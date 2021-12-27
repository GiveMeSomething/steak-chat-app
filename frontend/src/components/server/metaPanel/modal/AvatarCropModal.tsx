import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { useForm } from 'react-hook-form'

import { selectCurrentUser } from 'components/auth/redux/auth.slice'
import { updateUserAvatar } from 'components/auth/redux/user.thunk'

import { Undefinable } from 'types/commonType'
import { useUploadFile } from 'utils/fileUtil'
import { cropSetting } from 'constants/appConst'

import { Button, Icon, Modal } from 'semantic-ui-react'

import 'react-image-crop/dist/ReactCrop.css'
import ReactCrop, { Crop } from 'react-image-crop'

import DescMessage from 'components/commons/formDescription/DescMessage'
import ProgressBar from 'components/server/messages/userInput/ProgressBar'

interface AvatarCropModalProps {
    isOpen: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    imageSrc: string
    onAvatarCropClose: Function
}

const AvatarCropModal: FunctionComponent<AvatarCropModalProps> = ({
    isOpen,
    setOpen,
    imageSrc,
    onAvatarCropClose
}) => {
    const imageRef = useRef<HTMLImageElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const [crop, setCrop] = useState<Partial<Crop>>(cropSetting)
    const [completedCrop, setCompletedCrop] =
        useState<Undefinable<Crop>>(undefined)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const { handleSubmit } = useForm()

    const {
        uploadState,
        uploadProgress,
        uploadError,
        startUpload,
        resetState
    } = useUploadFile()

    const dispatch = useAppDispatch()
    const currentUser = useAppSelector(selectCurrentUser)

    // Reference: https://github.com/DominicTobias/react-image-crop - FAQ
    // To automatically draw a preview image based on crop field
    useEffect(() => {
        if (!completedCrop || !imageRef.current || !canvasRef.current) {
            return
        }

        const image = imageRef.current
        const canvas = canvasRef.current
        const crop = completedCrop

        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height
        const ctx = canvas.getContext('2d')
        if (!ctx) {
            return
        }

        const pixelRatio = window.devicePixelRatio

        canvas.width = crop.width * pixelRatio * scaleX
        canvas.height = crop.height * pixelRatio * scaleY

        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
        ctx.imageSmoothingQuality = 'medium'

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
        )
    }, [crop])

    const cropperStyle: React.CSSProperties = {
        maxHeight: '30rem',
        overflowY: 'auto'
    }

    // Fixed size 128px*128px, also help reducing size when upload to database
    const canvasStyle: React.CSSProperties = {
        width: 128,
        height: 128
    }

    const onModalClose = () => {
        setIsLoading(false)

        setCrop(cropSetting)
        setCompletedCrop(undefined)

        setOpen(false)
        onAvatarCropClose()
    }

    const onLoad = useCallback((img) => {
        resetState()
        setCrop(cropSetting)

        imageRef.current = img
    }, [])

    const uploadCroppedImage = async () => {
        if (!canvasRef.current || !crop || !currentUser) {
            return
        }

        const onUploadFinish = async (photoUrl: string): Promise<void> => {
            // Then update profile based on the receiveURL
            await dispatch(
                updateUserAvatar({ userId: currentUser.uid, photoUrl })
            )

            onModalClose()
        }

        // Upload Blob to Firebase Storage
        const canvas = canvasRef.current
        canvas.toBlob(async (blob) => {
            if (blob) {
                await startUpload(
                    blob,
                    `chat/avatar/${currentUser.uid}`,
                    onUploadFinish
                )
            }
        })
    }

    const handleOnCropChange = (crop: Crop) => {
        setCrop(crop)
        setCompletedCrop(crop)
    }

    const handleAvatarSubmit = async () => {
        setIsLoading(true)

        await uploadCroppedImage()

        setIsLoading(false)
    }

    return (
        <Modal
            as="form"
            onClose={onModalClose}
            size="tiny"
            dimmer="blurring"
            open={isOpen}
            onSubmit={handleSubmit(handleAvatarSubmit)}
        >
            <Modal.Header>
                <div className="flex items-center justify-between w-full">
                    <div
                        className="flex items-start cursor-pointer"
                        onClick={onModalClose}
                    >
                        <Icon name="chevron left" />
                        <h1 className="leading-none">Crop your photo</h1>
                    </div>
                    <div
                        className="flex justify-end cursor-pointer"
                        onClick={onModalClose}
                    >
                        <Icon name="x" />
                    </div>
                </div>
            </Modal.Header>
            <Modal.Content>
                <div className="mx-10">
                    <div className="aspect-w-1 aspect-h-1">
                        <div className="flex items-center justify-center bg-slack-sidebar-blur rounded-md">
                            <ReactCrop
                                src={imageSrc}
                                crop={crop}
                                circularCrop={true}
                                onImageLoaded={onLoad}
                                onChange={handleOnCropChange}
                                style={cropperStyle}
                            />
                        </div>
                    </div>
                    <p className="font-semibold text-xl py-2">Preview:</p>
                    <div className="grid grid-cols-3">
                        <div className="col-span-1">
                            <canvas ref={canvasRef} style={canvasStyle} />
                        </div>
                        <div className="col-span-2 flex items-center justify-center">
                            <p>
                                <b>&apos;Drag and drop&apos;</b> to crop avatar
                            </p>
                        </div>
                    </div>
                    {uploadState && <ProgressBar progress={uploadProgress} />}
                    {uploadError && <DescMessage error message={uploadError} />}
                </div>
            </Modal.Content>
            <Modal.Actions>
                <Button color="red" disabled={isLoading} onClick={onModalClose}>
                    <Icon name="remove" /> Cancel
                </Button>
                <Button
                    type="submit"
                    color="green"
                    className="submit"
                    disabled={isLoading}
                    loading={isLoading}
                >
                    <Icon name="checkmark" />
                    Save
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default AvatarCropModal
