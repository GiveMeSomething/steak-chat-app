import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import { useAppSelector } from 'redux/hooks'
import {
    selectMessages,
    selectSearchMessages,
    selectIsSearching,
} from '../redux/channelMessage.slice'

import MessageComponent from './MessageComponent'

interface MessagePanelProps {}

const MessagesPanel: FunctionComponent<MessagePanelProps> = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const messages = useAppSelector(selectMessages)
    const searchMessages = useAppSelector(selectSearchMessages)
    const isSearching = useAppSelector(selectIsSearching)

    const scrollToBottomDiv = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!messages || messages.length === 0) {
            setIsLoading(false)
        }
    }, [])

    // Scroll to bottom after the iamge is loaded
    useEffect(() => {
        scrollToBottomDiv.current?.scrollIntoView({ behavior: 'auto' })
        if (messages.length > 0) {
            setIsLoading(false)
        }
    }, [messages])

    // Display messages based on searchMessages and messages existance
    const messagePanelContent = () => {
        // Display search messages if in searching mode and if have any
        if (isSearching) {
            if (searchMessages.length > 0) {
                return searchMessages.map((searchMessage) => (
                    <MessageComponent
                        {...searchMessage}
                        key={searchMessage.id}
                    />
                ))
            } else {
                return <div>No message found (will make this pretty later)</div>
            }
        }

        // Display messages if not in searching mode
        if (!isSearching && messages && messages.length > 0) {
            return messages.map((message) => (
                <MessageComponent {...message} key={message.id} />
            ))
        }

        // Display welcome message if there are no messages
        return <div>Display welcome message if there is no message</div>
    }

    return (
        <>
            {isLoading && (
                <div className="h-full w-full flex items-center justify-center">
                    <div className="ui active inverted dimmer">
                        <div className="ui text loader">Loading</div>
                    </div>
                </div>
            )}
            <div className="flex flex-1 flex-col items-start justify-end overflow-auto overflow-x-hidden mb-20 px-4">
                <div
                    className="flex flex-col mt-auto"
                    id="message-panel__content"
                >
                    {messagePanelContent()}
                    <div ref={scrollToBottomDiv} />
                </div>
            </div>
        </>
    )
}

export default MessagesPanel
