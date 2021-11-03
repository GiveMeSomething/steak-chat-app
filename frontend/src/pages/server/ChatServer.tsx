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
    addChannel,
    selectCurrentChannel,
    setChannels,
} from './components/slices/channel.slice'

import ServerLayout from './components/ServerLayout'
import withAuthRedirect from 'components/middleware/withAuthRedirect'
import {
    clearMessages,
    clearSearchMessage,
    setMessages,
    addMessage,
} from './components/slices/channelMessage.slice'
import {
    addChannelUser,
    setChannelUsers,
} from './components/slices/channelUsers.slice'

interface ChatServerProps {}

const ChatServer: FunctionComponent<ChatServerProps> = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isServerFirstLoad, setIsServerFirstLoad] = useState<boolean>(true)
    const [isChannelFirstLoad, setIsChannelFirstLoad] = useState<boolean>(true)

    const dispatch = useAppDispatch()
    const currentChannel = useAppSelector(selectCurrentChannel)

    const channelsRef = ref(database, 'channels')
    const messagesRef = ref(database, `channels/${currentChannel.id}/messages`)
    const channelUsersRef = ref(database, 'users')

    const fetchChannels = () => {
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
    }

    const fetchCurrentChannelMessages = () => {
        // Fetch messages of current channel
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

    const fetchServerUsers = () => {
        // Fetch users of current channel
        onValue(
            query(channelUsersRef, orderByChild('username')),
            (data) => {
                const result: any[] = []
                data.forEach((user) => {
                    result.push(user.val())
                })

                dispatch(setChannelUsers(result))
            },
            { onlyOnce: true },
        )
    }

    // Get server's channels and users when server is loaded first time
    useEffect(() => {
        fetchChannels()
        fetchServerUsers()

        setIsServerFirstLoad(false)
    }, [])

    // Only run when currentChannel changed
    // To fetch all messages of currentChannel when currentChannel changed
    useEffect(() => {
        if (currentChannel && currentChannel.id) {
            // Clear current channel messages in Redux store
            dispatch(clearMessages())
            dispatch(clearSearchMessage())

            // Fetch all channel's messages and users on first load
            fetchCurrentChannelMessages()

            setIsChannelFirstLoad(false)
        }

        setIsLoading(false)
    }, [currentChannel.id])

    // This will be trigger when isServerFirstLoad changed (after the first data load is done)
    // Watch for others channel creation
    useEffect(() => {
        if (!isServerFirstLoad) {
            const channelUnsubScribe = onChildAdded(channelsRef, (data) => {
                dispatch(addChannel(data.val()))
            })

            return () => channelUnsubScribe()
        }
    }, [isServerFirstLoad])

    // This will be trigger when isChannelFirstLoad changed (after the first data load is done)
    // Watch for messages from other (realtime)
    // Watch for new user in channel
    useEffect(() => {
        const messagesUnsubscribe = onChildAdded(messagesRef, (data) => {
            if (!isChannelFirstLoad) {
                dispatch(addMessage(data.val()))
            }
        })

        const channelUsersUnsubscribe = onChildAdded(
            channelUsersRef,
            (data) => {
                if (!isChannelFirstLoad) {
                    dispatch(addChannelUser(data.val()))
                }
            },
        )

        return () => {
            messagesUnsubscribe()
            channelUsersUnsubscribe()
        }
    }, [])

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
