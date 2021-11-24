import React, { ChangeEvent, FunctionComponent, useState } from 'react'
import { useAppDispatch } from 'redux/hooks'
import { useForm } from 'react-hook-form'

import { getDownloadURL, ref, uploadBytesResumable } from '@firebase/storage'
import { storage } from 'firebase/firebase'

import { Modal, Button, Icon } from 'semantic-ui-react'
import { v4 as uuid } from 'uuid'

import { sendMessage } from '../slices/channelMessage.slice'

import { MAX_FILE_SIZE_BYTES } from 'utils/appConst'
import { extractFileExt } from 'utils/fileUtil'

import FormInput from './FormInput'
import ProgressBar from './ProgressBar'
import ErrorMessage from 'components/commons/ErrorMessage'

interface AddMediaModalProps {
    isOpen: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface FormValues {
    desc?: string
}

const AddMediaModal: FunctionComponent<AddMediaModalProps> = ({
    isOpen,
    setOpen,
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [userMedia, setUserMedia] = useState<File>()
    const [mediaUrl, setMediaUrl] = useState<string>('')

    const [uploadState, setUploadState] = useState<string>('')
    const [uploadError, setUploadError] = useState<string>('')

    const [uploadProgress, setUploadProgress] = useState<number>(0)

    const { handleSubmit, register, reset } = useForm<FormValues>()

    const dispatch = useAppDispatch()

    // Refs: https://firebase.google.com/docs/storage/web/upload-files#manage_uploads
    // Upload user image to Firebase storage and save message to Redux store
    const uploadFileToStorage = async (file: File, content: string) => {
        const filePath = `chat/public/${uuid()}.${extractFileExt(file.name)}`
        const storageRef = ref(storage, filePath)

        // Set current form states
        setIsLoading(true)
        setUploadState('uploading')

        // Upload things
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

                    // Set the state for according UI update
                    setUploadState(snapshot.state)
                },
                (err: any) => {
                    // TODO: Handle upload errors more specific if needed
                    if (err.message) {
                        setUploadError(err.message)
                    }
                },
                async () => {
                    // If successfully uploaded, dispatch sendMessage to display and save message to database
                    getDownloadURL(result.snapshot.ref).then(
                        async (downloadUrl) => {
                            // When done, dispatch a action to add message to redux store
                            await dispatch(
                                sendMessage({
                                    mediaPath: downloadUrl,
                                    content,
                                }),
                            )

                            // Close the modal after finish uploading
                            onClose()
                        },
                    )
                },
            )
        } catch (err: any) {
            // Catch any errors left
            setUploadError(err.message)
            onClose()
        }
    }

    // Close modal operations
    const onClose = () => {
        // Set modal state back to intial state
        setUploadState('')
        setUploadProgress(0)
        setUploadError('')
        setIsLoading(false)
        setMediaUrl('')

        // Reset form values
        reset()

        // Close modal
        setOpen(false)
    }

    // Upload the userMedia (and the desc) to database, then display as a message
    const onSubmit = async ({ desc = '' }: FormValues) => {
        if (userMedia) {
            await uploadFileToStorage(userMedia, desc)
        }
    }

    // Check file size
    const isImageValid = (imageFile: File | undefined): boolean => {
        if (!imageFile) {
            setUploadError('No image selected')
            return false
        }

        // Validate file size (by bytes)
        // Here it is limit to 5 * 1000 * 1000 ~ 5MB
        if (imageFile.size >= MAX_FILE_SIZE_BYTES) {
            setUploadError('Image size should not exceed 5MB')
            return false
        }

        return true
    }

    // This will show a preview before pushing the userMedia to Firebase Database
    const uploadFile = (event: ChangeEvent<HTMLInputElement>) => {
        const reader = new FileReader()
        const files = event.target.files

        if (files) {
            if (!isImageValid(files[0])) {
                return
            }

            const userUploadMedia = files[0]

            setUserMedia(userUploadMedia)

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
                    {
                        // Show preview image if user upload valid image
                        // Else show upload image option
                        mediaUrl && userMedia ? (
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
                                    onChange={uploadFile}
                                />
                                {uploadError && (
                                    <ErrorMessage content={uploadError} />
                                )}
                            </div>
                        )
                    }
                    <div className="pt-6">
                        <FormInput
                            label="Description (optional)"
                            type="text"
                            autoComplete="off"
                            {...register('desc')}
                        />
                    </div>
                    <ProgressBar
                        uploadState={uploadState}
                        progress={uploadProgress}
                    />
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
