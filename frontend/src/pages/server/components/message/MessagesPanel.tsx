import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import { useAppSelector } from 'redux/hooks'
import { selectMessages, selectSearchMessages } from '../message.slice'
import MessageComponent from './MessageComponent'

interface MessagePanelProps {}

const MessagesPanel: FunctionComponent<MessagePanelProps> = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [loadedMessage, setLoadedMessage] = useState<number>(0)

    const messages = useAppSelector(selectMessages)
    const searchMessages = useAppSelector(selectSearchMessages)

    const scrollToBottomDiv = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!messages || messages.length === 0) {
            setIsLoading(false)
        }
    }, [])

    // Scroll to bottom after the iamge is loaded
    useEffect(() => {
        scrollToBottomDiv.current?.scrollIntoView({ behavior: 'auto' })

        if (loadedMessage === messages?.length) {
            setIsLoading(false)
        }
    }, [loadedMessage])

    const incrementLoadedMessage = () => {
        setLoadedMessage(loadedMessage + 1)
    }

    // Display messages based on searchMessages and messages existance
    const messagePanelContent = () => {
        if (searchMessages && searchMessages.length > 0) {
            // Display search messages if have any
            return searchMessages.map((message) => (
                <MessageComponent
                    {...message}
                    key={message.id}
                    onMessageLoaded={incrementLoadedMessage}
                />
            ))
        } else if (messages && messages.length > 0) {
            // Else display normal messages
            return messages.map((message) => (
                <MessageComponent
                    {...message}
                    key={message.id}
                    onMessageLoaded={incrementLoadedMessage}
                />
            ))
        } else {
            // Or display welcome message if there are no messages
            return <div>Display welcome message if there is no message</div>
        }
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
            <div className="flex flex-1 flex-col items-start justify-end overflow-auto mb-20 px-4">
                <div
                    className="flex flex-col mt-auto"
                    style={{ maxHeight: '70vh' }}
                >
                    {messagePanelContent()}
                    <div ref={scrollToBottomDiv} />
                </div>
            </div>
        </>
    )
}

export default MessagesPanel
