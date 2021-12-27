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
    child
} from '@firebase/database'

import {
    addChannel,
    addStarredChannel,
    clearChannels,
    clearStarredChannel,
    selectCurrentChannel,
    selectIsDirectChannel,
    unStarChannel,
    updateChannelInfo
} from 'components/server/redux/channels/channels.slice'
import { selectCurrentUser } from 'components/auth/redux/auth.slice'
import {
    setMessages,
    clearMessages,
    clearSearchMessage,
    addMessage
} from 'components/server/redux/messages/messages.slice'
import {
    clearChannelUsers,
    addChannelUser,
    updateChannelUser
} from 'components/server/redux/users/users.slice'
import { updateUserStatus } from 'components/auth/redux/user.thunk'
import {
    addTyper,
    clearTyper,
    removeTyper,
    selectChannelMessageCount,
    setChannelMessageCount
} from 'components/server/redux/notifications/notifications.slice'
import { updateNotifications } from 'components/server/redux/channels/channels.thunk'
import { removeCurrentUserTyping } from 'components/server/redux/notifications/notifications.thunk'

import {
    CHANNELS_REF,
    MESSAGE_COUNT_REF,
    STARRED_REF,
    TYPING_REF,
    USERS_REF
} from 'utils/databaseRef'

import ServerLayout from 'components/server/ServerLayout'
import LoadingScreen from 'components/commons/overlay/LoadingScreen'
import withAuthRedirect from 'components/middleware/withAuthRedirect'
import { UserStatus } from 'types/appEnum'

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
            { onlyOnce: true }
        )
    }

    // Update message count to database, with user id as key
    const updateUserMessageCount = async () => {
        if (currentUser) {
            // Save status to users notifications
            const userMessageCountPath = `users/${currentUser.uid}/messageCount`
            const userMessageCountRef = ref(database, userMessageCountPath)
            await set(userMessageCountRef, channelMessageCount)
        }
    }

    useEffect(() => {
        if (currentUser) {
            dispatch(
                updateUserStatus({
                    userId: currentUser.uid,
                    status: UserStatus.ONLINE
                })
            )
            dispatch(setChannelMessageCount(currentUser?.messageCount))
        }

        dispatch(clearChannels())
        dispatch(clearStarredChannel())
        dispatch(clearChannelUsers())

        const unsubscribeChannels = onChildAdded(CHANNELS_REF, (data) => {
            dispatch(addChannel(data.val()))
        })

        const unsubscribeChannelInfoChanged = onChildChanged(
            CHANNELS_REF,
            (data) => {
                dispatch(updateChannelInfo(data.val()))
            }
        )

        const unsubscribeChannelUsers = onChildAdded(USERS_REF, (data) => {
            dispatch(addChannelUser(data.val()))
        })

        const unsubscribeChannelUsersStatusChanged = onChildChanged(
            USERS_REF,
            (data) => {
                dispatch(updateChannelUser(data.val()))
            }
        )

        const unsubscribeStarredChannel = onChildAdded(
            STARRED_REF(currentUser?.uid),
            (data) => {
                dispatch(addStarredChannel(data.val()))
            }
        )

        const unsubscribeUnStarChannel = onChildRemoved(
            STARRED_REF(currentUser?.uid),
            (data) => {
                dispatch(unStarChannel(data.val()))
            }
        )

        // This run once and auto unsubscribe
        // Update notifications when user first load application
        onValue(
            MESSAGE_COUNT_REF,
            (data) => {
                if (data) {
                    dispatch(updateNotifications(data.val()))
                }
            },
            {
                onlyOnce: true
            }
        )

        // This will trigger on single child
        // This is more efficient than onValue as it run per changed (onValue return whole collection)
        const unsubscribeMessageCount = onChildChanged(
            MESSAGE_COUNT_REF,
            (data) => {
                if (data) {
                    dispatch(
                        // Construct similar object to onValue to reuse updateNotifications
                        updateNotifications({
                            [data.key as string]: data.val()
                        })
                    )
                }
            }
        )

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
        if (currentChannel && currentUser && currentChannel.id) {
            // Clear current channel messages in Redux store
            dispatch(clearMessages())
            dispatch(clearSearchMessage())

            // Remove currentUser typing tracker (in realtime database)
            dispatch(
                removeCurrentUserTyping({
                    channelId: currentChannel.id,
                    userId: currentUser.uid
                })
            )
            // Remove all typing tracker (in store)
            dispatch(clearTyper())

            const typingRef = child(TYPING_REF, `${currentChannel.id}`)
            const unsubscribeTypingTrackChanged = onChildAdded(
                typingRef,
                (data) => {
                    if (data && data.key) {
                        dispatch(
                            addTyper({
                                userId: data.key,
                                username: data.val()
                            })
                        )
                    }
                }
            )

            const unsubscribeTypingTrackRemoved = onChildRemoved(
                typingRef,
                (data) => {
                    if (data && data.key) {
                        dispatch(removeTyper({ userId: data.key }))
                    }
                }
            )

            // Add messages listener for current channel
            // onChildAdded will run for all initial value in database
            const unsubscribeMessages = onChildAdded(messagesRef, (data) => {
                dispatch(addMessage(data.val()))
            })

            // Fetch currentChannel's message with orderBy timestamp
            // This will override onChildAdded initial result (unordered)
            fetchChannelMessages()

            updateUserMessageCount()

            return () => {
                unsubscribeMessages()
                unsubscribeTypingTrackChanged()
                unsubscribeTypingTrackRemoved()
            }
        }
    }, [currentChannel.id])

    if (isMessageLoading) {
        return <LoadingScreen />
    } else {
        return <ServerLayout />
    }
}

export default withAuthRedirect<ChatServerProps>(ChatServer)
