import React, { FunctionComponent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from 'redux/hooks'

import { ChannelInfo, updateChannelDesc } from '../slices/channel.slice'
import { setCurrentMetaPanelData } from '../slices/metaPanel.slice'

import { Modal, Button, Icon } from 'semantic-ui-react'

import ErrorMessage from 'components/commons/ErrorMessage'
import FormInput from './FormInput'

interface UpdateChannelDescModalProps {
    isOpen: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    channelInfo: ChannelInfo
}

interface FormValues {
    channelDesc: string
}

const UpdateChannelDescModal: FunctionComponent<UpdateChannelDescModalProps> =
    ({ isOpen, setOpen, channelInfo }) => {
        const [isLoading, setIsLoading] = useState<boolean>()
        const [updateError, setUpdateError] = useState<string>()

        const dispatch = useAppDispatch()

        const {
            register,
            formState: { errors },
            setFocus,
            reset,
            handleSubmit,
        } = useForm<FormValues>()

        const onModalOpen = () => {
            setFocus('channelDesc')
            setOpen(true)
        }

        const onModalClose = () => {
            reset()
            setOpen(false)
        }

        const onSubmit = async (data: FormValues) => {
            setIsLoading(true)

            const { id } = channelInfo

            try {
                // Update channel description to Firebase
                await dispatch(
                    updateChannelDesc({
                        channelId: id,
                        content: data.channelDesc,
                    }),
                )

                // Update meta panel after update
                dispatch(setCurrentMetaPanelData(channelInfo))
            } catch (e: any) {
                if (e.message) {
                    setUpdateError(e.message)
                } else {
                    setUpdateError('Network Error. Please try again later')
                }
            }

            // Closing modal operations
            reset()
            setIsLoading(false)
            setOpen(false)
        }

        return (
            <Modal
                as="form"
                onOpen={onModalOpen}
                onClose={onModalClose}
                size="tiny"
                dimmer="blurring"
                open={isOpen}
                onSubmit={handleSubmit(onSubmit)}
            >
                <Modal.Header>
                    <h1>Edit description</h1>
                </Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <div>
                            <FormInput
                                {...register('channelDesc', {
                                    maxLength: {
                                        value: 120,
                                        message:
                                            'Channel description must not exceeds 120 characters',
                                    },
                                })}
                                label="Channel description"
                                type="text"
                                autoComplete="off"
                            />
                            {!errors.channelDesc && !updateError && (
                                <p className="text-sm font-semibold text-slack-searchbar">
                                    Let people know what this channel is for.
                                </p>
                            )}
                            {errors.channelDesc && (
                                <ErrorMessage
                                    content={errors.channelDesc.message}
                                />
                            )}
                            {updateError && (
                                <ErrorMessage content={updateError} />
                            )}
                        </div>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button
                        color="red"
                        onClick={onModalClose}
                        disabled={isLoading}
                    >
                        <Icon name="remove" /> Cancel
                    </Button>
                    <Button
                        type="submit"
                        color="green"
                        className="submit"
                        loading={isLoading}
                        disabled={isLoading}
                    >
                        <Icon name="checkmark" />
                        Save
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }

export default UpdateChannelDescModal
