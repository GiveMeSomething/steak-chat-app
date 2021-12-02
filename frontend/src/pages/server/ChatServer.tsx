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
    onChildRemoved,
} from '@firebase/database'

import {
    addChannel,
    addStarredChannel,
    clearChannels,
    clearStarredChannel,
    selectCurrentChannel,
    selectIsDirectChannel,
    unStarChannel,
    updateChannelInfo,
} from 'components/server/redux/channels/channels.slice'
import { selectCurrentUser } from 'components/auth/redux/auth.slice'

import ServerLayout from 'components/server/ServerLayout'
import withAuthRedirect from 'components/middleware/withAuthRedirect'
import {
    CHANNELS_REF,
    MESSAGE_COUNT_REF,
    STARRED_REF,
    USERS_REF,
} from 'utils/databaseRef'
import LoadingOverlay from 'components/commons/LoadingOverlay'
import {
    setMessages,
    clearMessages,
    clearSearchMessage,
    addMessage,
} from 'components/server/redux/messages/messages.slice'
import {
    clearChannelUsers,
    addChannelUser,
    updateChannelUser,
} from 'components/server/redux/users/users.slice'
import {
    selectChannelMessageCount,
    setChannelMessageCount,
} from 'components/server/redux/notifications/notifications.slice'
import { updateNotifications } from 'components/server/redux/channels/channels.thunk'

interface ChatServerProps {}

const ChatServer: FunctionComponent<ChatServerProps> = () => {
    const [isMessageLoading, setIsMessageLoading] = useState<boolean>(true)

    const dispatch = useAppDispatch()

    const currentUser = useAppSelector(selectCurrentUser)

    const currentChannel = useAppSelector(selectCurrentChannel)
    const isDirectChannel = useAppSelector(selectIsDirectChannel)

    const channelMessageCount = useAppSelector(selectChannelMessageCount)

    // Get messageRef based on public or private channel (direct messages)
    const messagesRef = ((): DatabaseReference => {
        if (isDirectChannel) {
            return ref(database, `direct-message/${currentChannel.id}/messages`)
        } else {
            return ref(database, `channels/${currentChannel.id}/messages`)
        }
    })()

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
        dispatch(clearChannels())
        dispatch(clearStarredChannel())
        dispatch(clearChannelUsers())

        dispatch(setChannelMessageCount(currentUser?.messageCount))

        const unsubscribeChannels = onChildAdded(CHANNELS_REF, (data) => {
            dispatch(addChannel(data.val()))
        })

        const unsubscribeChannelInfoChanged = onChildChanged(
            CHANNELS_REF,
            (data) => {
                dispatch(updateChannelInfo(data.val()))
            },
        )

        const unsubscribeChannelUsers = onChildAdded(USERS_REF, (data) => {
            dispatch(addChannelUser(data.val()))
        })

        const unsubscribeChannelUsersStatusChanged = onChildChanged(
            USERS_REF,
            (data) => {
                dispatch(updateChannelUser(data.val()))
            },
        )

        const unsubscribeStarredChannel = onChildAdded(
            STARRED_REF(currentUser?.uid),
            (data) => {
                dispatch(addStarredChannel(data.val()))
            },
        )

        const unsubscribeUnStarChannel = onChildRemoved(
            STARRED_REF(currentUser?.uid),
            (data) => {
                dispatch(unStarChannel(data.val()))
            },
        )

        const unsubscribeMessageCount = onValue(MESSAGE_COUNT_REF, (data) => {
            if (data) {
                dispatch(updateNotifications(data.val()))
            }
        })

        setIsMessageLoading(false)

        return () => {
            unsubscribeChannels()
            unsubscribeChannelInfoChanged()
            unsubscribeChannelUsers()
            unsubscribeStarredChannel()
            unsubscribeUnStarChannel()
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
        return <LoadingOverlay />
    } else {
        return <ServerLayout />
    }
}

export default withAuthRedirect<ChatServerProps>(ChatServer)
