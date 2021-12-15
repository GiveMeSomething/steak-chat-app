import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import { useAppSelector } from 'redux/hooks'

import {
    Message,
    selectIsSearching,
    selectMessages,
    selectSearchMessages,
} from 'components/server/redux/messages/messages.slice'

import MessageComponent from './message/Message'
import { selectChannelUsers } from '../redux/users/users.slice'
import { UserInfo } from 'components/auth/redux/auth.slice'

interface MessagePanelProps {}

const usersMap = new Map<string, UserInfo>()

const MessagesPanel: FunctionComponent<MessagePanelProps> = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const messages = useAppSelector(selectMessages)
    const channelUsers = useAppSelector(selectChannelUsers)
    const searchMessages = useAppSelector(selectSearchMessages)
    const isSearching = useAppSelector(selectIsSearching)

    const scrollToBottomDiv = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Init usersMap when component mount
        channelUsers.forEach((user) => {
            usersMap.set(user.uid, user)
        })

        if (!messages || messages.length === 0) {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        // Update usersMap when an user is added/removed
        channelUsers.forEach((user) => usersMap.set(user.uid, user))
    }, [channelUsers])

    // Scroll to bottom after the image is loaded
    useEffect(() => {
        scrollToBottomDiv.current?.scrollIntoView({ behavior: 'auto' })
        if (messages.length > 0) {
            setIsLoading(false)
        }
    }, [messages, searchMessages])

    const getMessageComponent = (message: Message) => {
        const { createdBy, ...messageInfo } = message

        const creator = usersMap.get(createdBy.uid)

        return creator ? (
            <MessageComponent
                {...messageInfo}
                key={messageInfo.id}
                createdBy={creator}
            />
        ) : null
    }

    // Display messages based on searchMessages and messages
    const messagePanelContent = () => {
        if (isSearching) {
            if (searchMessages.length > 0) {
                return searchMessages.map((message) =>
                    getMessageComponent(message),
                )
            } else {
                // TODO: Make better UI for dis
                return <div>No message found</div>
            }
        }

        if (!isSearching && messages.length > 0) {
            return messages.map((message) => getMessageComponent(message))
        }

        // Display welcome message if there are no messages
        // TODO: Make better UI for dis
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
