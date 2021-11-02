import React, { FunctionComponent, useEffect, useRef } from 'react'
import { useAppSelector } from 'redux/hooks'
import { selectMessages, selectSearchMessages } from '../message.slice'
import MessageComponent from './MessageComponent'

interface MessagePanelProps {}

const MessagesPanel: FunctionComponent<MessagePanelProps> = () => {
    const messages = useAppSelector(selectMessages)
    const searchMessages = useAppSelector(selectSearchMessages)

    const scrollToBottomDiv = useRef<HTMLDivElement>(null)

    // Display messages based on searchMessages and messages existance
    const messagePanelContent = () => {
        if (searchMessages && searchMessages.length > 0) {
            // Display search messages if have any
            return searchMessages.map((message) => (
                <MessageComponent {...message} key={message.id} />
            ))
        } else if (messages && messages.length > 0) {
            // Else display normal messages
            return messages.map((message) => (
                <MessageComponent {...message} key={message.id} />
            ))
        } else {
            // Or display welcome message if there are no messages
            return <div>Display welcome message if there is no message</div>
        }
    }

    useEffect(() => {
        scrollToBottomDiv.current?.scrollIntoView({ behavior: 'auto' })
    }, [messages])

    return (
        <div className="flex flex-1 flex-col items-start justify-end overflow-auto mb-20 px-4">
            <div
                className="flex flex-col mt-auto"
                style={{ maxHeight: '70vh' }}
            >
                {messagePanelContent()}
                <div ref={scrollToBottomDiv} />
            </div>
        </div>
    )
}

export default MessagesPanel
