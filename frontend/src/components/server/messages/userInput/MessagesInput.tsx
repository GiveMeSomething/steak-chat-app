import React, { FunctionComponent, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { useForm } from 'react-hook-form'

import { selectTyper } from 'components/server/redux/notifications/notifications.slice'
import { selectCurrentChannel } from 'components/server/redux/channels/channels.slice'
import { setMessageLoading } from 'components/server/redux/messages/messages.slice'
import { selectCurrentUser } from 'components/auth/redux/auth.slice'
import { sendMessage } from 'components/server/redux/messages/messages.thunk'
import {
    removeCurrentUserTyping,
    setCurrentUserTyping
} from 'components/server/redux/notifications/notifications.thunk'

import { Undefinable } from 'types/commonType'

import { Button, Input, Popup } from 'semantic-ui-react'

import 'emoji-mart/css/emoji-mart.css'
import { Picker, Emoji, BaseEmoji } from 'emoji-mart'

import ScreenOverlay from 'components/commons/overlay/ScreenOverlay'
import AddMediaModal from './AddMediaModal'
import TypingLoader from './TypingLoader'

interface MessagesInputProps {}

interface FormValues {
    message: string | ''
}

const MessagesInput: FunctionComponent<MessagesInputProps> = () => {
    const [isAddMediaModalOpen, setAddMediaModalOpen] = useState<boolean>(false)
    const [isEmojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false)
    const [isEmojiPcikerHover, setEmojiPickerHover] = useState<boolean>(false)

    const dispatch = useAppDispatch()
    const currentChannel = useAppSelector(selectCurrentChannel)
    const currentUser = useAppSelector(selectCurrentUser)
    const typers = useAppSelector(selectTyper)

    const { register, handleSubmit, reset, setFocus, setValue, getValues } =
        useForm<FormValues>()

    // Set focus to input when change to new channel (and when load current channel)
    useEffect(() => {
        if (currentChannel.id) {
            setFocus('message')
        }
    }, [currentChannel.id])

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
                }
            )
        }

        return result + ' is typing'
    }

    const onSubmit = async ({ message }: FormValues) => {
        reset()

        if (message && message.trim() !== '') {
            dispatch(setMessageLoading(true))
            await dispatch(sendMessage({ message }))
        }

        // Remove currentChannel typingRef when user send current message
        currentUser &&
            dispatch(
                removeCurrentUserTyping({
                    channelId: currentChannel.id,
                    userId: currentUser.uid
                })
            )

        reset()
        setFocus('message')
    }

    const handleOnMouseEnterEmojiPicker = () => {
        setEmojiPickerHover(true)
    }

    const handleOnMouseLeaveEmojiPicker = () => {
        if (isEmojiPickerOpen) {
            return
        }
        setEmojiPickerHover(false)
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
            username: currentUser.username
        }

        if (!currentMessage || currentMessage.trim().length <= 0) {
            dispatch(removeCurrentUserTyping(payload))
        } else if (!typers[currentUser.uid]) {
            dispatch(setCurrentUserTyping(payload))
        }
    }

    const toggleEmojiPicker = () => {
        setEmojiPickerOpen(!isEmojiPickerOpen)
    }

    const handleSelectEmoji = (emoji: Undefinable<BaseEmoji> = undefined) => {
        if (emoji && emoji.native) {
            setValue('message', `${getValues('message')} ${emoji.native} `)
        }

        setEmojiPickerOpen(false)
        setEmojiPickerHover(false)

        setFocus('message')
    }

    if (!currentChannel.id || currentChannel.id === '') {
        return null
    }

    return (
        <>
            {Object.keys(typers).length > 0 && (
                <div className="flex items-center px-2 m-0">
                    <TypingLoader />
                    {getTypers()}
                </div>
            )}
            <div className="flex mb-4 px-4 mx-auto w-full max-h-15">
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
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="w-full grid grid-cols-8 items-center mr-2"
                >
                    <Input
                        placeholder={`Message #${currentChannel.name}`}
                        className="rounded-md col-span-7 border-slack-text-blur w-full"
                    >
                        <input
                            {...register('message')}
                            className="w-full"
                            autoComplete="off"
                            onKeyUp={handleInputKeyup}
                        />
                    </Input>
                    <div>
                        <div
                            className="relative col-span-1"
                            onClick={toggleEmojiPicker}
                            onMouseEnter={handleOnMouseEnterEmojiPicker}
                            onMouseLeave={handleOnMouseLeaveEmojiPicker}
                        >
                            {isEmojiPickerOpen && (
                                <>
                                    <div className="absolute bottom-10 right-0">
                                        <Picker
                                            set="facebook"
                                            title="Pick"
                                            perLine={9}
                                            emojiSize={32}
                                            onSelect={(emoji) =>
                                                handleSelectEmoji(
                                                    emoji as BaseEmoji
                                                )
                                            }
                                        />
                                    </div>
                                    <ScreenOverlay
                                        handleOnClick={() =>
                                            handleSelectEmoji()
                                        }
                                    />
                                </>
                            )}
                            <div className="flex items-center justify-center border-slack-sidebar-focus">
                                {isEmojiPcikerHover ? (
                                    <Emoji
                                        emoji="slightly_smiling_face"
                                        set="facebook"
                                        size={32}
                                    />
                                ) : (
                                    <Emoji
                                        emoji="expressionless"
                                        set="facebook"
                                        size={32}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </form>
                {isAddMediaModalOpen && (
                    <AddMediaModal
                        currentMessage={getValues('message')}
                        isOpen={isAddMediaModalOpen}
                        setOpen={setAddMediaModalOpen}
                    />
                )}
            </div>
        </>
    )
}

export default MessagesInput
