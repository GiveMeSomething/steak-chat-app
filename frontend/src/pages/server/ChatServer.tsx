import React, { FunctionComponent, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'

import {
    DatabaseReference,
    onChildAdded,
    onChildChanged,
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
    DIRECT_MSG_REF,
    MESSAGE_COUNT_REF,
    STARRED_REF,
    TYPING_REF,
    USERS_REF
} from 'utils/databaseRef'
import { UserStatus } from 'types/appEnum'

import withAuthRedirect from 'components/middleware/withAuthRedirect'
import LoadingScreen from 'components/commons/overlay/LoadingScreen'
import ServerLayout from 'components/server/ServerLayout'

interface ChatServerProps {}

const ChatServer: FunctionComponent<ChatServerProps> = () => {
    const [isMessageLoading, setIsMessageLoading] = useState<boolean>(true)

    const dispatch = useAppDispatch()
    const currentUser = useAppSelector(selectCurrentUser)
    const currentChannel = useAppSelector(selectCurrentChannel)
    const isDirectChannel = useAppSelector(selectIsDirectChannel)
    const channelMessageCount = useAppSelector(selectChannelMessageCount)

    // Get messageRef based on public or private channel (direct messages)
    const getMessagesRef = (): DatabaseReference => {
        const messagePath = `${currentChannel.id}/messages`
        return child(
            isDirectChannel ? DIRECT_MSG_REF : CHANNELS_REF,
            messagePath
        )
    }

    const getTypingRef = () => child(TYPING_REF, `${currentChannel.id}`)

    // Get all messages of currentChannel, order by ascending timestamp
    const fetchChannelMessages = () => {
        onValue(
            query(getMessagesRef(), orderByChild('timestamp')),
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
            const userMessageCountPath = `${currentUser.uid}/messageCount`
            const userMessageCountRef = child(USERS_REF, userMessageCountPath)

            await set(userMessageCountRef, channelMessageCount)
        }
    }

    const updateUserStatusAndMessageCount = () => {
        if (currentUser) {
            dispatch(
                updateUserStatus({
                    userId: currentUser.uid,
                    status: UserStatus.ONLINE
                })
            )
            dispatch(setChannelMessageCount(currentUser?.messageCount))
        }
    }

    const updateUserNotifications = () => {
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
    }

    const refreshChannelsData = () => {
        dispatch(clearChannels())
        dispatch(clearStarredChannel())
        dispatch(clearChannelUsers())
    }

    const refreshCurrentChannelData = () => {
        if (currentUser) {
            dispatch(clearMessages())
            dispatch(clearSearchMessage())
            dispatch(clearTyper())

            // Clear on firebase database
            dispatch(
                removeCurrentUserTyping({
                    channelId: currentChannel.id,
                    userId: currentUser.uid
                })
            )
        }
    }

    useEffect(() => {
        // Update when ChatServer loaded
        updateUserStatusAndMessageCount()

        // Clear redux state about previous channels
        refreshChannelsData()

        // Watch when user add new channel
        const unsubscribeChannels = onChildAdded(CHANNELS_REF, (data) => {
            dispatch(addChannel(data.val()))
        })

        // Watch when user change channel info
        const unsubscribeChannelInfoChanged = onChildChanged(
            CHANNELS_REF,
            (data) => {
                dispatch(updateChannelInfo(data.val()))
            }
        )

        // Watch when new user enter channel
        const unsubscribeChannelUsers = onChildAdded(USERS_REF, (data) => {
            dispatch(addChannelUser(data.val()))
        })

        // Watch when users' info changed
        const unsubscribeChannelUsersChanged = onChildChanged(
            USERS_REF,
            (data) => {
                dispatch(updateChannelUser(data.val()))
            }
        )

        // Watch when user star channel
        const unsubscribeStarredChannel = onChildAdded(
            child(STARRED_REF, `${currentUser?.uid}`),
            (data) => {
                data.key && dispatch(addStarredChannel(data.key))
            }
        )

        // Watch when user unstar channel
        const unsubscribeUnStarChannel = onChildRemoved(
            child(STARRED_REF, `${currentUser?.uid}`),
            (data) => {
                data.key && dispatch(unStarChannel(data.key))
            }
        )

        // Watch when user update their messageCount (by visiting a new channel)
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
            unsubscribeStarredChannel()
            unsubscribeUnStarChannel()
            unsubscribeChannelUsers()
            unsubscribeChannelUsersChanged()
            unsubscribeMessageCount()
        }
    }, [])

    useEffect(() => {
        if (currentChannel && currentUser && currentChannel.id) {
            // Clear redux about previous channel
            refreshCurrentChannelData()
            updateUserMessageCount()
            updateUserNotifications()

            // Watch when user typing
            const unsubscribeTypingTrackChanged = onChildAdded(
                getTypingRef(),
                (data) => {
                    if (data.key) {
                        dispatch(
                            addTyper({
                                userId: data.key,
                                username: data.val()
                            })
                        )
                    }
                }
            )

            // Watch when user exiting typing
            const unsubscribeTypingTrackRemoved = onChildRemoved(
                getTypingRef(),
                (data) => {
                    if (data.key) {
                        dispatch(removeTyper({ userId: data.key }))
                    }
                }
            )

            // Watch users add messages
            const unsubscribeMessages = onChildAdded(
                getMessagesRef(),
                (data) => {
                    dispatch(addMessage(data.val()))
                }
            )

            // Fetch currentChannel's message with orderBy timestamp
            // Override onChildAdded result
            fetchChannelMessages()

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
