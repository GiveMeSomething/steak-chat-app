import { createAsyncThunk } from '@reduxjs/toolkit'
import { set, get, ref, increment, serverTimestamp } from 'firebase/database'
import { database } from 'firebase/firebase'
import { ThunkState } from 'types/commonType'
import { ChannelInfo } from '../channels/channels.slice'
import { v4 as uuid } from 'uuid'
import {
    Message,
    SendMessagePayload,
    setMessageLoading
} from './messages.slice'

const saveMessageToDatabase = async (
    message: Message,
    currentChannel: ChannelInfo,
    isDirectChannel: boolean
) => {
    let messageRef
    const messageCountRef = ref(database, `messageCount/${currentChannel.id}`)

    // Set messages destination based on public channel or private channel (direct messages)
    if (isDirectChannel) {
        messageRef = ref(
            database,
            `direct-message/${currentChannel.id}/messages/${message.id}`
        )
    } else {
        messageRef = ref(
            database,
            `channels/${currentChannel.id}/messages/${message.id}`
        )
    }

    // Add 1 to messageCountRef, based on the server current value
    await set(messageCountRef, increment(1))

    // Set object to database, this will trigger child_added to re-render page
    await set(messageRef, message)

    return get(messageRef)
}

export const sendMessage = createAsyncThunk<
    void,
    SendMessagePayload,
    ThunkState
>('message/sendMessage', async (data, { getState, dispatch }) => {
    const appState = getState()
    const currentUser = appState.user.user
    const currentChannel = appState.channels.currentChannel
    const isDirectMessage = appState.channels.isDirectChannel

    if (currentUser) {
        const createdBy = {
            uid: currentUser.uid
        }

        // Create new message object to send to database
        const message: Message = {
            id: uuid(),
            timestamp: serverTimestamp(),
            content: data.message,
            media: data.mediaPath || '',
            createdBy
        }

        await saveMessageToDatabase(message, currentChannel, isDirectMessage)

        // Cancel loading state
        dispatch(setMessageLoading(false))
    }
})
