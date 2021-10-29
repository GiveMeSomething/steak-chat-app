import React, { FunctionComponent } from 'react'
import { useForm } from 'react-hook-form'
import { useAppDispatch } from 'redux/hooks'
import { Button, Input, Popup } from 'semantic-ui-react'
import { sendMessage, setMessageLoading } from '../message.slice'
import AddMediaModal from '../modal/AddMediaModal'

interface MessagesInputProps {
    channel: string
    isAddMediaModalOpen: boolean
    setAddMediaModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

interface Message {
    content: string
}

const MessagesInput: FunctionComponent<MessagesInputProps> = ({
    channel,
    isAddMediaModalOpen,
    setAddMediaModalOpen,
}) => {
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
                trigger={
                    <Button
                        basic
                        icon="paperclip"
                        color="blue"
                        onClick={() => setAddMediaModalOpen(true)}
                    />
                }
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
            <AddMediaModal
                isOpen={isAddMediaModalOpen}
                setOpen={setAddMediaModalOpen}
            />
        </div>
    )
}

export default MessagesInput
