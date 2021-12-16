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
import { selectTyper } from 'components/server/redux/notifications/notifications.slice'
import TypingLoader from './TypingLoader'

interface MessagesInputProps {}

interface FormValues {
    message: string | ''
}

const MessagesInput: FunctionComponent<MessagesInputProps> = () => {
    const [isAddMediaModalOpen, setAddMediaModalOpen] = useState<boolean>(false)

    const dispatch = useAppDispatch()
    const currentChannel = useAppSelector(selectCurrentChannel)
    const currentUser = useAppSelector(selectCurrentUser)
    const typers = useAppSelector(selectTyper)

    const { register, handleSubmit, reset, setFocus, getValues } =
        useForm<FormValues>()

    // Set focus to input when change to new channel (and when load current channel)
    useEffect(() => {
        setFocus('message')
    }, [currentChannel])

    const getTypers = (): string => {
        const numberOfTyper = Object.keys(typers).length
        let result = ''
        if (numberOfTyper === 1) {
            result = Object.values(typers)[0]
        } else {
            result = Object.values(typers).reduce(
                (previousValue, currentValue, currentIndex) => {
                    if (currentIndex === 0) {
                        return currentValue
                    } else if (currentIndex === numberOfTyper - 1) {
                        return previousValue + ' and ' + currentValue
                    } else {
                        return previousValue + ', ' + currentValue
                    }
                },
            )
        }

        return result + ' is typing'
    }

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

    const handleInputKeyup = () => {
        if (!currentUser) {
            return
        }

        const currentMessage = getValues('message')
        const payload = {
            channelId: currentChannel.id,
            userId: currentUser.uid,
            username: currentUser.username,
        }

        if (!currentMessage || currentMessage.trim().length <= 0) {
            dispatch(removeCurrentUserTyping(payload))
        } else if (!typers[currentUser.uid]) {
            dispatch(setCurrentUserTyping(payload))
        }
    }

    const handleInputKeyup = () => {
        if (!currentUser) {
            return
        }

        const currentMessage = getValues('message')
        const payload = {
            channelId: currentChannel.id,
            userId: currentUser.uid,
            username: currentUser.username,
        }

        if (!currentMessage || currentMessage.trim().length <= 0) {
            dispatch(removeCurrentUserTyping(payload))
        } else if (!typers[currentUser.uid]) {
            dispatch(setCurrentUserTyping(payload))
        }
    }

    return (
        <>
            {Object.keys(typers).length > 0 && (
                <div className="flex items-center px-2 m-0">
                    <TypingLoader />
                    {getTypers()}
                </div>
            )}
            <div className="flex items-baseline mb-4 px-4 mx-auto w-full max-h-15">
                <Popup
                    message="Attach file"
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
                            onKeyUp={handleInputKeyup}
                        />
                    </Input>
                </form>
                <AddMediaModal
                    currentMessage={getValues('message')}
                    isOpen={isAddMediaModalOpen}
                    setOpen={setAddMediaModalOpen}
                />
                )
            </div>
        </>
    )
}

export default MessagesInput
