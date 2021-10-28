import React, { FunctionComponent, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { useParams } from 'react-router'

import { database } from 'firebase/firebase'
import { onChildAdded, onValue, ref } from '@firebase/database'

import { addMessage, setMessages } from './components/message.slice'
import {
    addChannel,
    selectCurrentChannel,
    setChannels,
} from './components/channel.slice'

import ServerLayout from './components/ServerLayout'
import withAuthRedirect from 'components/middleware/withAuthRedirect'

interface ChatServerProps {}

const ChatServer: FunctionComponent<ChatServerProps> = () => {
    const [isFirstLoad, setIsFirstLoad] = useState(true)
    const { id } = useParams<{ id: string }>()

    const dispatch = useAppDispatch()
    const currentChannel = useAppSelector(selectCurrentChannel)

    const channelsRef = ref(database, 'channels')
    const messagesRef = ref(database, `channels/${currentChannel}/messages`)

    console.log('Server ID: ' + id)

    // Get all data needed here
    useEffect(() => {
        // Fetch channels in current server
        onValue(
            channelsRef,
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
        if (currentChannel) {
            // Fetch message of current channel
            // This will guarantee currentChannel value is provided to messageRef
            onValue(
                messagesRef,
                (data) => {
                    dispatch(setMessages(data.val()))
                },
                { onlyOnce: true },
            )
        }
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

    return <ServerLayout />
}

export default withAuthRedirect(ChatServer)
