import React, { FunctionComponent, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { useForm } from 'react-hook-form'

import { selectCurrentChannel } from 'components/server/redux/channels/channels.slice'
import { setMessageLoading } from 'components/server/redux/messages/messages.slice'
import { sendMessage } from 'components/server/redux/messages/messages.thunk'

import { Button, Input, Popup } from 'semantic-ui-react'

import AddMediaModal from './AddMediaModal'
import 'emoji-mart/css/emoji-mart.css'
import { Picker, Emoji, EmojiData } from 'emoji-mart'
import ScreenOverlay from 'components/commons/ScreenOverlay'

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

        reset()
    }

    const handleOnMouseEnterEmojiPicker = () => {
        setEmojiPickerHover(true)
    }

    const handleOnMouseLeaveEmojiPicker = () => {
        setEmojiPickerHover(false)
    }

    const handleAddMediaClick = () => {
        setAddMediaModalOpen(true)
        reset()
    }

    const toggleEmojiPicker = () => {
        setEmojiPickerOpen(!isEmojiPickerOpen)
    }

    const handleSelectEmoji = (emoji: EmojiData) => {
        if (emoji) {
            console.log(emoji)
        }

        setEmojiPickerOpen(false)
    }

    return (
        <div className="flex mb-4 px-4 mx-auto w-full max-h-15">
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
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-full grid grid-cols-8 items-center mr-2"
            >
                <Input
                    placeholder={`Message #${currentChannel.name}`}
                    className="col-span-7 border-slack-text-blur rounded-lg"
                >
                    <input
                        {...register('message')}
                        className="w-full"
                        autoComplete="off"
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
                                <div className="z-20 absolute bottom-10 right-0">
                                    <Picker
                                        set="facebook"
                                        title="Pick"
                                        perLine={9}
                                        emojiSize={32}
                                        onSelect={handleSelectEmoji}
                                    />
                                </div>
                                <ScreenOverlay
                                    handleOnClick={() =>
                                        setEmojiPickerOpen(false)
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
    )
}

export default MessagesInput
