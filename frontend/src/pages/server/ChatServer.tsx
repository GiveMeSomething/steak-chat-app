import React, { FunctionComponent, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'

import { database } from 'firebase/firebase'
import {
    DatabaseReference,
    onChildAdded,
    onChildChanged,
    ref,
} from '@firebase/database'

import {
    addChannel,
    selectCurrentChannel,
    selectIsDirectChannel,
} from './components/slices/channel.slice'

import ServerLayout from './components/ServerLayout'
import withAuthRedirect from 'components/middleware/withAuthRedirect'
import {
    addMessage,
    clearMessages,
    clearSearchMessage,
    setMessages,
} from './components/slices/channelMessage.slice'
import {
    addChannelUser,
    clearChannelUsers,
    updateChannelUser,
} from './components/slices/channelUsers.slice'
import { onValue, query, orderByChild } from 'firebase/database'

interface ChatServerProps {}

const ChatServer: FunctionComponent<ChatServerProps> = () => {
    const [isMessageLoading, setIsMessageLoading] = useState<boolean>(true)

    const dispatch = useAppDispatch()

    const currentChannel = useAppSelector(selectCurrentChannel)
    const isDirectChannel = useAppSelector(selectIsDirectChannel)

    const channelsRef = ref(database, 'channels')
    const channelUsersRef = ref(database, 'users')

    // Get messageRef based on public or private channel (direct messages)
    const getMessageRef = (): DatabaseReference => {
        if (isDirectChannel) {
            return ref(database, `direct-message/${currentChannel.id}/messages`)
        } else {
            return ref(database, `channels/${currentChannel.id}/messages`)
        }
    }
    const messagesRef = getMessageRef()

    const fetchChannelMessages = () => {
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

        setIsMessageLoading(false)
    }

    useEffect(() => {
        // Clear users list
        dispatch(clearChannelUsers())

        const unsubscribeChannels = onChildAdded(channelsRef, (data) => {
            dispatch(addChannel(data.val()))
        })

        const unsubscribeChannelUsers = onChildAdded(
            channelUsersRef,
            (data) => {
                dispatch(addChannelUser(data.val()))
            },
        )

        const unsubscribeChannelUsersChanged = onChildChanged(
            channelUsersRef,
            (data) => {
                dispatch(updateChannelUser(data.val()))
            },
        )

        return () => {
            unsubscribeChannels()
            unsubscribeChannelUsers()
            unsubscribeChannelUsersChanged()
        }
    }, [])

    useEffect(() => {
        if (currentChannel && currentChannel.id) {
            // Clear current channel messages in Redux store
            dispatch(clearMessages())
            dispatch(clearSearchMessage())

            // Add messages listener for current channel
            // onChildAdded will run for all initial value in database
            const unsubscribeMessages = onChildAdded(messagesRef, (data) => {
                dispatch(addMessage(data.val()))
            })

            // Fetch currentChannel's message with orderBy timestamp
            // This will override onChildAdded initial result (unordered)
            fetchChannelMessages()

            return () => unsubscribeMessages()
        }
    }, [currentChannel.id])

    if (isMessageLoading) {
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

export default withAuthRedirect<ChatServerProps>(ChatServer)
