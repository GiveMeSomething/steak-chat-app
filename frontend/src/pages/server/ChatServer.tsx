import React, { FunctionComponent, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'

import { database } from 'firebase/firebase'
import {
    onChildAdded,
    onValue,
    query,
    ref,
    orderByChild,
} from '@firebase/database'

import {
    addMessage,
    clearMessages,
    setMessages,
} from './components/message.slice'
import {
    addChannel,
    selectCurrentChannel,
    setChannels,
} from './components/channel.slice'

import ServerLayout from './components/ServerLayout'
import withAuthRedirect from 'components/middleware/withAuthRedirect'

interface ChatServerProps {}

const ChatServer: FunctionComponent<ChatServerProps> = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true)

    const dispatch = useAppDispatch()
    const currentChannel = useAppSelector(selectCurrentChannel)

    const channelsRef = ref(database, 'channels')
    const messagesRef = ref(database, `channels/${currentChannel}/messages`)

    // Get all data needed here
    useEffect(() => {
        // Fetch channels in current server
        onValue(
            query(channelsRef, orderByChild('name')),
            (data) => {
                dispatch(setChannels(data.val()))
            },
            {
                onlyOnce: true,
            },
        )

        setIsFirstLoad(false)
    }, [])

    // Only run when currentChannel changed
    // To fetch all messages of currentChannel
    useEffect(() => {
        // Clear current channel messages
        dispatch(clearMessages())

        if (currentChannel) {
            // Fetch message of current channel
            // This will guarantee currentChannel value is provided to messageRef

            onValue(
                query(messagesRef, orderByChild('timestamp')),
                (data) => {
                    const result: any[] = []
                    data.forEach((message) => {
                        result.push(message.val())
                    })

                    dispatch(setMessages(result))
                },
                { onlyOnce: true },
            )
        }

        setIsLoading(false)
    }, [currentChannel])

    // This will be trigger when isFirstLoad changed (after the first data load is done)
    useEffect(() => {
        if (!isFirstLoad) {
            // Subscribe to changed and child_added here
            const channelUnsubScribe = onChildAdded(channelsRef, (data) => {
                dispatch(addChannel(data.val()))
            })

            const messageUnsubscribe = onChildAdded(messagesRef, (data) => {
                dispatch(addMessage(data.val()))
            })

            return () => {
                channelUnsubScribe()
                messageUnsubscribe()
            }
        }
    }, [isFirstLoad])

    if (isLoading) {
        return (
            <div className="h-screen w-screen max-h-screen flex items-center justify-center">
                <div className="ui active inverted dimmer">
                    <div className="ui text loader">Loading</div>
                </div>
            </div>
        )
    } else {
        return <ServerLayout />
    }
}

export default withAuthRedirect(ChatServer)
