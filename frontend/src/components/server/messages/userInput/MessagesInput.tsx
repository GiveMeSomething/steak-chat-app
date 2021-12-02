import React, { FunctionComponent, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { useForm } from 'react-hook-form'

import { selectCurrentChannel } from 'components/server/redux/channels/channels.slice'
import { setMessageLoading } from 'components/server/redux/messages/messages.slice'
import { sendMessage } from 'components/server/redux/messages/messages.thunk'

import { Button, Input, Popup } from 'semantic-ui-react'

import AddMediaModal from './AddMediaModal'

interface MessagesInputProps {}

interface FormValues {
    message: string | ''
}

const MessagesInput: FunctionComponent<MessagesInputProps> = () => {
    const [isAddMediaModalOpen, setAddMediaModalOpen] = useState<boolean>(false)

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

    const handleAddMediaClick = () => {
        setAddMediaModalOpen(true)
        reset()
    }

    return (
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
