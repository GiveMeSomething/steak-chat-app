import React, { FunctionComponent, useEffect, useState } from 'react'
import { useAppDispatch } from 'redux/hooks'
import { useForm } from 'react-hook-form'

import { sendMessage } from 'components/server/redux/messages/messages.thunk'

import { extractFileExt, isImageValid, useUploadFile } from 'utils/fileUtil'
import { Undefinable } from 'types/commonType'
import { v4 as uuid } from 'uuid'

import { Modal, Button, Icon } from 'semantic-ui-react'

import DescMessage from 'components/commons/formDescription/DescMessage'
import FormInput from 'components/commons/FormInput'
import ProgressBar from './ProgressBar'

interface AddMediaModalProps {
    currentMessage: string
    isOpen: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface FormValues {
    desc: string | ''
}

const AddMediaModal: FunctionComponent<AddMediaModalProps> = ({
    currentMessage,
    isOpen,
    setOpen
}) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [userMedia, setUserMedia] = useState<File>()
    const [mediaUrl, setMediaUrl] = useState<Undefinable<string>>(undefined)
    const [imageError, setImageError] = useState<Undefinable<string>>(undefined)

    const { handleSubmit, register, reset, setFocus, setValue } =
        useForm<FormValues>()

    const dispatch = useAppDispatch()

    useEffect(() => {
        if (isOpen) {
            setValue('desc', currentMessage)
            setFocus('desc')
        }
    }, [isOpen])

    const { startUpload, uploadState, uploadProgress, uploadError } =
        useUploadFile()

    // This will show a preview before pushing the userMedia to Firebase Database
    const uploadFileToPreview = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const reader = new FileReader()
        const files = event.target.files

        if (files) {
            if (!isImageValid(files[0])) {
                setImageError('Image size should not exceed 5MB')
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

    const handleClose = () => {
        // Set modal state back to intial state
        setIsLoading(false)
        setMediaUrl(undefined)

        // Reset form values
        reset()

        // Close modal
        setOpen(false)
    }

    // Upload the userMedia (and the desc) to database, then display as a message
    const onSubmit = async ({ desc }: FormValues) => {
        const onUploadFinish = async (downloadUrl: string) => {
            // When done, dispatch a action to add message to redux store
            await dispatch(
                sendMessage({
                    mediaPath: downloadUrl,
                    message: desc
                })
            )

            // Close the modal after finish uploading
            handleClose()
        }

        if (userMedia) {
            await startUpload(
                userMedia,
                `chat/public/${uuid()}.${extractFileExt(userMedia.name)}`,
                onUploadFinish
            )
        }
    }

    return (
        <Modal
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            onClose={handleClose}
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
                                onChange={uploadFileToPreview}
                            />
                            {uploadError && (
                                <DescMessage error message={uploadError} />
                            )}
                            {imageError && (
                                <DescMessage error message={imageError} />
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
                {uploadState && <ProgressBar progress={uploadProgress} />}
            </Modal.Content>
            <Modal.Actions>
                <Button color="red" onClick={handleClose}>
                    <Icon name="remove" /> Cancel
                </Button>
                <Button
                    type="submit"
                    color="green"
                    disabled={isLoading}
                    loading={isLoading}
                    className="submit"
                >
                    <Icon name="checkmark" />
                    Add
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default AddMediaModal
