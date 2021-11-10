import React, { FunctionComponent, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'

import { database } from 'firebase/firebase'
import {
    DatabaseReference,
    onChildAdded,
    onChildChanged,
    ref,
    set,
    onValue,
    query,
    orderByChild,
} from '@firebase/database'

import {
    addChannel,
    addStarredChannel,
    clearChannels,
    clearStarredChannel,
    selectCurrentChannel,
    selectIsDirectChannel,
    updateNotifications,
} from './components/slices/channel.slice'
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
import {
    selectChannelMessageCount,
    setOneChannelMessageCount,
} from './components/slices/notification.slice'
import { selectCurrentUser } from 'pages/auth/components/auth.slice'

import ServerLayout from './components/ServerLayout'
import withAuthRedirect from 'components/middleware/withAuthRedirect'

interface ChatServerProps {}

const ChatServer: FunctionComponent<ChatServerProps> = () => {
    const [isMessageLoading, setIsMessageLoading] = useState<boolean>(true)

    const dispatch = useAppDispatch()

    const currentUser = useAppSelector(selectCurrentUser)

    const currentChannel = useAppSelector(selectCurrentChannel)
    const isDirectChannel = useAppSelector(selectIsDirectChannel)

    const channelMessageCount = useAppSelector(selectChannelMessageCount)

    const channelsRef = ref(database, 'channels')
    const channelUsersRef = ref(database, 'users')
    const messageCountRef = ref(database, 'messageCount')
    const starredChannelRef = ref(database, 'starredChannels')

    // Get messageRef based on public or private channel (direct messages)
    const getMessageRef = (): DatabaseReference => {
        if (isDirectChannel) {
            return ref(database, `direct-message/${currentChannel.id}/messages`)
        } else {
            return ref(database, `channels/${currentChannel.id}/messages`)
        }
    }
    const messagesRef = getMessageRef()

    // Get all messages of currentChannel, order by ascending timestamp
    const fetchChannelMessages = () => {
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

    // Update message count to database, with user id as key
    const updateUserMessageCount = async () => {
        // Save status to users notifications
        const userMessageCountPath = `users/${currentUser?.uid}/messageCount`
        await set(ref(database, userMessageCountPath), channelMessageCount)
    }

    useEffect(() => {
        // Clear channels
        dispatch(clearChannels())

        // Clear currentUser starred channel
        dispatch(clearStarredChannel())

        // Clear users list
        dispatch(clearChannelUsers())

        // Get message count from user info fetch
        dispatch(setOneChannelMessageCount(currentUser?.messageCount))

        const unsubscribeChannels = onChildAdded(channelsRef, (data) => {
            dispatch(addChannel(data.val()))
        })

        const unsubscribeChannelUsers = onChildAdded(
            channelUsersRef,
            (data) => {
                dispatch(addChannelUser(data.val()))
            },
        )

        const unsubscribeStarredChannel = onChildAdded(
            starredChannelRef,
            (data) => {
                dispatch(addStarredChannel(data.val()))
            },
        )

        const unsubscribeChannelUsersStatusChanged = onChildChanged(
            channelUsersRef,
            (data) => {
                dispatch(updateChannelUser(data.val()))
            },
        )

        const unsubscribeMessageCount = onValue(messageCountRef, (data) => {
            const result = data.val()
            if (result) {
                dispatch(updateNotifications(data.val()))
            }
        })

        setIsMessageLoading(false)

        return () => {
            unsubscribeChannels()
            unsubscribeChannelUsers()
            unsubscribeStarredChannel()
            unsubscribeChannelUsersStatusChanged()
            unsubscribeMessageCount()
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

            updateUserMessageCount()

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
