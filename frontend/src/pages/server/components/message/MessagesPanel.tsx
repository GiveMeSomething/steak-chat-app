import React, { FunctionComponent, useEffect, useRef } from 'react'
import { useAppSelector } from 'redux/hooks'
import { selectMessages } from '../message.slice'
import MessageComponent from './MessageComponent'

interface MessagePanelProps {}

const MessagesPanel: FunctionComponent<MessagePanelProps> = () => {
    const messages = useAppSelector(selectMessages)

    const scrollToBottomDiv = useRef<HTMLDivElement>(null)

    const messageList = () =>
        messages && messages.length > 0 ? (
            messages.map((message) => (
                <MessageComponent {...message} key={message.id} />
            ))
        ) : (
            <div>Display welcome message if there is no message</div>
        )

    useEffect(() => {
        scrollToBottomDiv.current?.scrollIntoView({ behavior: 'auto' })
    }, [messages])

    return (
        <div className="flex flex-1 flex-col items-start justify-end overflow-auto mb-20 px-4">
            <div
                className="flex flex-col mt-auto"
                style={{ maxHeight: '70vh' }}
            >
                {messageList()}
                <div ref={scrollToBottomDiv} />
            </div>
        </div>
    )
}

export default MessagesPanel
