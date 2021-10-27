import { onChildAdded, onValue, ref } from '@firebase/database'
import { database } from 'firebase/firebase'
import React, { FunctionComponent, useEffect } from 'react'
import { useAppDispatch } from 'redux/hooks'
import { setMessages } from '../message.slice'
import MessagesHeader from './MessagesHeader'
import MessagesInput from './MessagesInput'
import MessagesPanel from './MessagesPanel'

interface MessagesProps {
    currentChannel: string
}

const Messages: FunctionComponent<MessagesProps> = ({ currentChannel }) => {
    const dispatch = useAppDispatch()

    useEffect(() => {
        const channelMessagesPath = `channels/${currentChannel}/messages`

        // Get chat history here
        onValue(
            ref(database, channelMessagesPath),
            async (data) => {
                dispatch(setMessages(data.val()))
            },
            { onlyOnce: true },
        )

        // Displat new message when new child added
        const unsubscribe = onChildAdded(
            ref(database, channelMessagesPath),
            async () => {},
        )

        return () => unsubscribe()
    }, [currentChannel])

    useEffect(() => {
        // Listen to child-added to frequently update chat history
    })

    return (
        <div className="flex flex-col h-full relative">
            <div className="">
                <MessagesHeader />
            </div>
            <MessagesPanel />
            <div className="absolute bottom-10 w-full">
                <MessagesInput channel={currentChannel} />
            </div>
        </div>
    )
}

export default Messages
