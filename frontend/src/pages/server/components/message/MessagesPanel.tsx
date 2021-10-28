import React, { FunctionComponent } from 'react'
import { useAppSelector } from 'redux/hooks'
import { selectMessages } from '../message.slice'
import MessageComponent from './MessageComponent'

interface MessagePanelProps {}

const MessagesPanel: FunctionComponent<MessagePanelProps> = () => {
    const messages = useAppSelector(selectMessages)

    const messageList = () =>
        messages && messages.length > 0 ? (
            messages.map((message) => (
                <MessageComponent {...message} key={message.id} />
            ))
        ) : (
            <div></div>
        )

    return (
        <div className="flex flex-col w-full h-60 items-start justify-end message-panel overflow-y-scroll mb-20 px-4">
            {messageList()}
        </div>
    )
}

export default MessagesPanel
