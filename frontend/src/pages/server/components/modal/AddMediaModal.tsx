import { getDownloadURL, ref, uploadBytesResumable } from '@firebase/storage'
import { storage } from 'firebase/firebase'
import React, { ChangeEvent, FunctionComponent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from 'redux/hooks'
import { Modal, Button, Icon } from 'semantic-ui-react'
import { v4 as uuid } from 'uuid'
import { sendMessage } from '../message.slice'
import FormInput from './FormInput'

interface AddMediaModalProps {
    isOpen: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface FormValues {
    media: File
    desc?: string
}

const AddMediaModal: FunctionComponent<AddMediaModalProps> = ({
    isOpen,
    setOpen,
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [media, setMedia] = useState<File>()
    const [mediaUrl, setMediaUrl] = useState<string>('')

    const [uploadState, setUploadState] = useState<string>('')
    const [uploadError, setUploadError] = useState<string>('')

    const [uploadProgress, setUploadProgress] = useState(0)

    const {
        handleSubmit,
        register,
        reset,
        setError,
        formState: { errors },
    } = useForm<FormValues>()

    const dispatch = useAppDispatch()

    const extractFileExt = (fileName: string): string => {
        const lastDot = fileName.lastIndexOf('.')
        return fileName.slice(lastDot)
    }

    // Refs: https://firebase.google.com/docs/storage/web/upload-files#manage_uploads
    const uploadFileToStorage = async (file: File, content: string) => {
        const filePath = `chat/public/${uuid()}.${extractFileExt(file.name)}`
        const storageRef = ref(storage, filePath)

        setUploadState('uploading')

        try {
            const result = uploadBytesResumable(storageRef, file)

            // Register three observers:
            // 1. 'state_changed' observer, called any time the state changes
            // 2. Error observer, called on failure
            // 3. Completion observer, called on successful completion
            result.on(
                'state_changed',
                (snapshot) => {
                    // Watch progress to display a progress bar for better UX
                    const progress = Math.round(
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
                    )
                    setUploadProgress(progress)
                    console.log(progress)

                    // Set the state for according UI update
                    setUploadState(snapshot.state)
                },
                (err: any) => {
                    // TODO: Handle upload errors more specific if needed
                    if (err.message) {
                        setUploadError(err.message)
                        console.log(err)
                    } else {
                        console.log(err)
                    }
                },
                () => {
                    // If successfully uploaded, dispatch sendMessage to display and save message to database
                    getDownloadURL(result.snapshot.ref).then((downloadUrl) => {
                        dispatch(
                            sendMessage({
                                mediaPath: downloadUrl,
                                content,
                            }),
                        )
                    })
                },
            )
        } catch (err: any) {
            setUploadError(err.message)
        }
    }

    // Close modal operations
    const onClose = () => {
        setIsLoading(false)
        setMedia(undefined)
        setMediaUrl('')

        reset({ desc: '' })

        setOpen(false)
    }

    // Upload the media (and the desc) to database, then display as a message
    const onSubmit = async ({ desc = '' }: FormValues) => {
        setIsLoading(true)

        if (media) {
            await uploadFileToStorage(media, desc)
        }

        console.log(uploadState)
        console.log(uploadError)
        console.log(uploadProgress)

        onClose()
    }

    // Check file size
    const isImageValid = (imageFile: File): boolean => {
        // Validate file size (by bytes)
        // Here it is limit to 5 * 1000 * 1000 ~ 5MB
        if (imageFile.size >= 5 * 1000 * 1000) {
            setError(
                'media',
                { message: 'Image size should not exceed 5MB' },
                { shouldFocus: false },
            )

            return false
        }

        return true
    }

    // This will show a preview before pushing the media to Firebase Database
    const uploadFile = (event: ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader()
        const files = event.target.files

        if (files && files[0]) {
            const userUploadMedia = files[0]

            if (!isImageValid(userUploadMedia)) {
                return
            }

            setMedia(userUploadMedia)

            reader.readAsDataURL(userUploadMedia)
            reader.onloadend = () => {
                if (reader.result) {
                    setMediaUrl(reader.result as string)
                }
            }
        }
    }

    return (
        <>
            <Modal
                as="form"
                onSubmit={handleSubmit(onSubmit)}
                onClose={onClose}
                onOpen={() => setOpen(true)}
                size="tiny"
                dimmer="blurring"
                open={isOpen}
            >
                <Modal.Header>
                    <h1>Upload image</h1>
                </Modal.Header>
                <Modal.Content>
                    {mediaUrl && media ? (
                        <img src={mediaUrl} className="max-h-40" />
                    ) : (
                        <div className="flex flex-col items-center justify-center bg-slack-sidebar-blur py-10">
                            <label
                                htmlFor="upload-file"
                                className="bg-slack-sidebar-hover text-white px-6 py-2 rounded-md cursor-pointer"
                            >
                                Add your image
                            </label>
                            <input
                                type="file"
                                accept="image/png, image/gif, image/jpeg"
                                id="upload-file"
                                hidden
                                {...register('media', {
                                    onChange: uploadFile,
                                    required: 'No image selected',
                                })}
                            />
                            {errors.media && (
                                <p className="text-red-600 font-semibold pt-2">
                                    {errors.media.message}
                                </p>
                            )}
                        </div>
                    )}
                    <div className="pt-6">
                        <FormInput
                            label="Description (optional)"
                            type="text"
                            autoComplete="off"
                            {...register('desc')}
                        />
                    </div>
                </Modal.Content>
                <Modal.Actions>
                    <Button color="red" onClick={onClose}>
                        <Icon name="remove" /> Cancel
                    </Button>
                    <Button
                        type="submit"
                        color="green"
                        disabled={isLoading}
                        loading={isLoading}
                        className="submit"
                    >
                        <Icon name="checkmark" /> Add
                    </Button>
                </Modal.Actions>
            </Modal>
        </>
    )
}

export default AddMediaModal
