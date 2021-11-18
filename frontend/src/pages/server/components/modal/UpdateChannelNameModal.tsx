import React, { FunctionComponent, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from 'redux/hooks'

import { ChannelInfo, updateChannelName } from '../slices/channel.slice'
import { setCurrentMetaPanelData } from '../slices/metaPanel.slice'

import { BANNED_SPECIAL_CHARACTERS_REGEX } from 'utils/appConst'
import { formatChannelName } from 'utils/channelUtil'
import { Modal, Button, Icon } from 'semantic-ui-react'

import ErrorMessage from 'components/commons/ErrorMessage'
import FormInput from './FormInput'

interface UpdateChannelNameModalProps {
    isOpen: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    channelInfo: ChannelInfo
}

interface FormValues {
    channelName: string
}

const UpdateChannelNameModal: FunctionComponent<UpdateChannelNameModalProps> =
    ({ isOpen, setOpen, channelInfo }) => {
        const [isLoading, setIsLoading] = useState<boolean>()
        const [updateError, setUpdateError] = useState<string>()

        const dispatch = useAppDispatch()

        const noSpecialCharMessage =
            'Channel names can’t contain spaces, periods, or most punctuation.'

        const {
            register,
            formState: { errors },
            setFocus,
            reset,
            handleSubmit,
        } = useForm<FormValues>()

        const onModalOpen = () => {
            setFocus('channelName')
            setOpen(true)
        }

        const onModalClose = () => {
            reset()
            setOpen(false)
        }

        const onSubmit = async (data: FormValues) => {
            setIsLoading(true)

            const { id } = channelInfo
            const channelName = formatChannelName(data.channelName)

            // Check if user input the same thing (after format)
            if (!(channelName === channelInfo.name)) {
                try {
                    // Update channel name to Firebase
                    await dispatch(
                        updateChannelName({
                            channelId: id,
                            content: channelName,
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
                    <h1>Rename this channel</h1>
                </Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <div>
                            <FormInput
                                {...register('channelName', {
                                    required: 'This field is required',
                                    minLength: {
                                        value: 6,
                                        message:
                                            'Channel name must be longer than 6 characters',
                                    },
                                    maxLength: {
                                        value: 80,
                                        message:
                                            'Channel name must not exceeds 80 characters',
                                    },
                                    validate: {
                                        noSpecialChar: (value: string) =>
                                            !value.match(
                                                BANNED_SPECIAL_CHARACTERS_REGEX,
                                            ),
                                    },
                                })}
                                label="Channel Name"
                                type="text"
                                autoComplete="off"
                            />
                            {errors.channelName &&
                                errors.channelName.type === 'noSpecialChar' && (
                                    <ErrorMessage
                                        content={noSpecialCharMessage}
                                    />
                                )}
                            {errors.channelName && (
                                <ErrorMessage
                                    content={errors.channelName.message}
                                />
                            )}
                            {updateError && (
                                <ErrorMessage content={updateError} />
                            )}
                            <p className="font-semibold text-slack-text-blur w-full text-base leading-2">
                                Names must be lowercase, without spaces or
                                special characters.
                            </p>
                            <p className="font-semibold text-slack-text-blur w-full text-base leading-2">
                                (Although we will convert it into the right
                                format for you 😉)
                            </p>
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
                        Save Changes
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }

export default UpdateChannelNameModal
