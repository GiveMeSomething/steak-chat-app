import React, { FunctionComponent } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { Button, Input, Popup } from 'semantic-ui-react'
import { selectCurrentChannel } from '../channel.slice'
import { sendMessage, setMessageLoading } from '../message.slice'

interface MessagesInputProps {}

interface Message {
    content: string
}

const MessagesInput: FunctionComponent<MessagesInputProps> = () => {
    const currentChannel = useAppSelector(selectCurrentChannel)

    const dispatch = useAppDispatch()
    const { register, handleSubmit, reset } = useForm<Message>()

    const onSubmit = async (data: Message) => {
        // Clear user input onSubmit
        reset()

        // Call dispatch to send message to database
        dispatch(setMessageLoading(true))
        await dispatch(
            sendMessage({ channel: currentChannel.id, content: data.content }),
        )
    }

    return (
        <div className="flex items-baseline mb-4 px-4 mx-auto w-full max-h-15">
            <Popup
                content="Attach file"
                trigger={<Button basic icon="paperclip" color="blue" />}
            />
            <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                <Input
                    placeholder="Message #name"
                    className="rounded-md border-slack-text-blur w-full"
                >
                    <input
                        {...register('content')}
                        className="w-full"
                        autoComplete="off"
                    />
                </Input>
            </form>
        </div>
    )
}

export default MessagesInput
