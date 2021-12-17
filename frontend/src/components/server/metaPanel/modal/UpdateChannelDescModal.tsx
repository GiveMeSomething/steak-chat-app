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
    updateChannelDesc
} from 'components/server/redux/channels/channels.thunk'

import { findChannelById } from 'utils/channelUtil'

import { Modal, Button, Icon } from 'semantic-ui-react'

import DescMessage from 'components/commons/formDescription/DescMessage'
import FormInput from 'components/commons/FormInput'

interface UpdateChannelDescModalProps {
    isOpen: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    channelInfo: ChannelInfo
}

interface FormValues {
    channelDesc: string
}

const UpdateChannelDescModal: FunctionComponent<
    UpdateChannelDescModalProps
> = ({ isOpen, setOpen, channelInfo }) => {
    const [isLoading, setIsLoading] = useState<boolean>()
    const [updateError, setUpdateError] = useState<string>()

    const dispatch = useAppDispatch()

    const channels = useAppSelector(selectChannels)
    const starred = useAppSelector(selectStarredChannels)
    const currentChannel = useAppSelector(selectCurrentChannel)

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
            setValue('channelDesc', channelInfo.desc ? channelInfo.desc : '')
            setFocus('channelDesc')
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

        const { id } = channelInfo

        try {
            // Update channel description to Firebase
            await dispatch(
                updateChannelDesc({
                    channelId: id,
                    content: data.channelDesc
                })
            )
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
                                        'Channel description must not exceeds 120 characters'
                                }
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
                            <DescMessage
                                error
                                message={errors.channelDesc.message}
                            />
                        )}
                        {updateError && (
                            <DescMessage error message={updateError} />
                        )}
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
                    Save
                </Button>
            </Modal.Actions>
        </Modal>
    )
}

export default UpdateChannelDescModal
