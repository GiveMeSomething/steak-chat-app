import React, { FunctionComponent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from 'redux/hooks'

import { setCurrentMetaPanelData } from 'components/server/metaPanel/redux/metaPanel.slice'
import {
    ChannelInfo,
    selectChannels,
    selectStarredChannels,
    selectCurrentChannel
} from 'components/server/redux/channels/channels.slice'
import {
    setCurrentChannel,
    updateChannelName
} from 'components/server/redux/channels/channels.thunk'

import { BANNED_SPECIAL_CHARACTERS_REGEX } from 'constants/appConst'
import { findChannelById, formatChannelName } from 'utils/channelUtil'

import { Modal, Button, Icon } from 'semantic-ui-react'

import DescMessage from 'components/commons/formDescription/DescMessage'
import FormInput from 'components/commons/FormInput'

interface UpdateChannelNameModalProps {
    isOpen: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    channelInfo: ChannelInfo
}

interface FormValues {
    channelName: string
}

const UpdateChannelNameModal: FunctionComponent<
    UpdateChannelNameModalProps
> = ({ isOpen, setOpen, channelInfo }) => {
    const [isLoading, setIsLoading] = useState<boolean>()
    const [updateError, setUpdateError] = useState<string>()

    const dispatch = useAppDispatch()

    const channels = useAppSelector(selectChannels)
    const starred = useAppSelector(selectStarredChannels)
    const currentChannel = useAppSelector(selectCurrentChannel)

    const noSpecialCharMessage =
        'Channel names can’t contain spaces, periods, or most punctuation.'

    const {
        register,
        formState: { errors },
        setFocus,
        setValue,
        reset,
        handleSubmit
    } = useForm<FormValues>()

    useEffect(() => {
        if (isOpen) {
            setValue('channelName', channelInfo.name)
            setFocus('channelName')
        }
    }, [isOpen])

    useEffect(() => {
        const updatedChannel = findChannelById(
            channelInfo.id,
            channels,
            starred
        )

        if (updatedChannel) {
            dispatch(setCurrentMetaPanelData(updatedChannel))

            if (currentChannel.id === channelInfo.id) {
                dispatch(setCurrentChannel(updatedChannel))
            }
        }
    }, [channels, starred])

    const onModalClose = () => {
        reset()
        setOpen(false)
    }

    const onSubmit = async (data: FormValues) => {
        setIsLoading(true)
        const channelName = formatChannelName(data.channelName)

        // Check if user input the same thing (after format)
        if (!(channelName === channelInfo.name)) {
            try {
                // Update channel name to Firebase
                await dispatch(
                    updateChannelName({
                        channelId: channelInfo.id,
                        content: channelName
                    })
                )
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
                                        'Channel name must be longer than 6 characters'
                                },
                                maxLength: {
                                    value: 80,
                                    message:
                                        'Channel name must not exceeds 80 characters'
                                },
                                validate: {
                                    noSpecialChar: (value: string) =>
                                        !value.match(
                                            BANNED_SPECIAL_CHARACTERS_REGEX
                                        )
                                }
                            })}
                            label="Channel Name"
                            type="text"
                            autoComplete="off"
                        />
                        {errors.channelName &&
                            errors.channelName.type === 'noSpecialChar' && (
                                <DescMessage
                                    error
                                    message={noSpecialCharMessage}
                                />
                            )}
                        {errors.channelName && (
                            <DescMessage
                                error
                                message={errors.channelName.message}
                            />
                        )}
                        {updateError && (
                            <DescMessage error message={updateError} />
                        )}
                        <p className="font-semibold text-slack-text-blur w-full text-base leading-2">
                            Names must be lowercase, without spaces or special
                            characters.
                        </p>
                        <p className="font-semibold text-slack-text-blur w-full text-base leading-2">
                            (Although we will convert it into the right format
                            for you 😉)
                        </p>
                    </div>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button color="red" onClick={onModalClose} disabled={isLoading}>
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
