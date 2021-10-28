import React, { FunctionComponent } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from 'redux/hooks'
import { Button, Input, Popup } from 'semantic-ui-react'
import { sendMessage, setMessageLoading } from '../message.slice'

interface MessagesInputProps {
    channel: string
}

interface Message {
    content: string
}

const MessagesInput: FunctionComponent<MessagesInputProps> = ({ channel }) => {
    const dispatch = useAppDispatch()
    const { register, handleSubmit, reset } = useForm<Message>()

    const onSubmit = async (data: Message) => {
        // Clear user input onSubmit
        reset()

        // Call dispatch to send message to database
        dispatch(setMessageLoading(true))
        await dispatch(sendMessage({ channel, content: data.content }))
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
