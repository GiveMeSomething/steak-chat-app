import React, { FunctionComponent, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { useForm } from 'react-hook-form'

import { selectCurrentChannel } from 'components/server/redux/channels/channels.slice'
import { setMessageLoading } from 'components/server/redux/messages/messages.slice'
import { sendMessage } from 'components/server/redux/messages/messages.thunk'

import { Button, Input, Popup } from 'semantic-ui-react'

import AddMediaModal from './AddMediaModal'
import { selectCurrentUser } from 'components/auth/redux/auth.slice'
import {
    removeCurrentUserTyping,
    setCurrentUserTyping,
} from 'components/server/redux/notifications/notifications.thunk'

interface MessagesInputProps {}

interface FormValues {
    message: string | ''
}

const MessagesInput: FunctionComponent<MessagesInputProps> = () => {
    const [isAddMediaModalOpen, setAddMediaModalOpen] = useState<boolean>(false)

    const dispatch = useAppDispatch()
    const currentChannel = useAppSelector(selectCurrentChannel)
    const currentUser = useAppSelector(selectCurrentUser)

    const { register, handleSubmit, reset, setFocus, getValues } =
        useForm<FormValues>()

    // Set focus to input when change to new channel (and when load current channel)
    useEffect(() => {
        setFocus('message')
    }, [currentChannel])

    const onSubmit = async ({ message }: FormValues) => {
        if (message && message.trim() !== '') {
            dispatch(setMessageLoading(true))
            await dispatch(sendMessage({ message }))
        }

        // Remove currentChannel typingRef when user send current message
        currentUser &&
            dispatch(
                removeCurrentUserTyping({
                    channelId: currentChannel.id,
                    userId: currentUser.uid,
                }),
            )

        reset()
    }

    const handleAddMediaClick = () => {
        setAddMediaModalOpen(true)
    }

    const handleInputKeydown = () => {
        if (!currentUser) {
            return
        }

        const currentMessage = getValues('message')
        const payload = {
            channelId: currentChannel.id,
            userId: currentUser.uid,
        }
        if (currentMessage) {
            dispatch(setCurrentUserTyping(payload))
        } else {
            dispatch(removeCurrentUserTyping(payload))
        }
    }

    return (
        <div className="flex items-baseline mb-4 px-4 mx-auto w-full max-h-15">
            <Popup
                content="Attach file"
                trigger={
                    <Button
                        basic
                        icon="paperclip"
                        color="blue"
                        onClick={handleAddMediaClick}
                    />
                }
            />
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <Input
                    placeholder={`Message #${currentChannel.name}`}
                    className="rounded-md border-slack-text-blur w-full"
                >
                    <input
                        {...register('message')}
                        className="w-full"
                        autoComplete="off"
                        onKeyDown={handleInputKeydown}
                    />
                </Input>
            </form>
            {isAddMediaModalOpen && (
                <AddMediaModal
                    currentMessage={getValues('message')}
                    isOpen={isAddMediaModalOpen}
                    setOpen={setAddMediaModalOpen}
                />
            )}
        </div>
    )
}

export default MessagesInput
