import React, {
    FunctionComponent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react'

import { Button, Icon, Modal } from 'semantic-ui-react'

import ReactCrop, { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Undefinable } from 'types/commonType'

interface AvatarCropModalProps {
    isOpen: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    imageSrc: string
}

const AvatarCropModal: FunctionComponent<AvatarCropModalProps> = ({
    isOpen,
    setOpen,
    imageSrc,
}) => {
    const imageRef = useRef<HTMLImageElement | null>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [crop, setCrop] = useState<Partial<Crop>>({
        aspect: 1,
        unit: '%',
        width: 100,
        height: 100,
    })
    const [completedCrop, setCompletedCrop] =
        useState<Undefinable<Crop>>(undefined)

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
        ctx.imageSmoothingQuality = 'high'

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY,
        )
    }, [crop])

    const onLoad = useCallback((img) => {
        imageRef.current = img
    }, [])

    const handleOnCropChange = (crop: Crop) => {
        setCrop(crop)
    }

    const handleOnCropComplete = (crop: Crop) => {
        setCompletedCrop(crop)
    }

    const onModalClose = () => {
        setOpen(false)
    }

    return (
        <Modal
            as="form"
            onClose={onModalClose}
            size="tiny"
            dimmer="blurring"
            open={isOpen}
        >
            <Modal.Header>
                <h1>Edit your profile</h1>
            </Modal.Header>
            <Modal.Content>
                <div className="mx-8">
                    <div className="aspect-w-1">
                        <div className="flex items-center justify-center bg-slack-sidebar-blur rounded-md">
                            <ReactCrop
                                src={imageSrc}
                                crop={crop}
                                circularCrop={true}
                                onImageLoaded={onLoad}
                                onChange={handleOnCropChange}
                                onComplete={handleOnCropComplete}
                            />
                        </div>
                    </div>
                    <div>
                        <canvas
                            ref={canvasRef}
                            // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                            style={{
                                width: Math.round(completedCrop?.width ?? 0),
                                height: Math.round(completedCrop?.height ?? 0),
                            }}
                        />
                    </div>
                </div>
            </Modal.Content>
            <Modal.Actions>
                <Button color="red">
                    <Icon name="remove" /> Cancel
                </Button>
                <Button type="submit" color="green" className="submit">
                    <Icon name="checkmark" />
                    Save
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default AvatarCropModal
