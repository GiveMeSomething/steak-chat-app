import { get, increment, ref, serverTimestamp, set } from '@firebase/database'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { database } from 'firebase/firebase'
import { RootState } from 'redux/store'
import { ThunkState, Undefinable } from 'types/commonType'
import { v4 as uuid } from 'uuid'
import { ChannelInfo } from './channel.slice'

export interface Message {
    id: string
    content: string
    timestamp: object
    media: Undefinable<string>
    createdBy: {
        uid?: string
        username?: string
        photoUrl?: string
    }
}

interface SendMessagePayload {
    message: string
    mediaPath?: string
}

interface MessagesState {
    messages: Message[]
    searchMessages: Message[]
    messageError: string | 'EMPTY'
    isMessageLoading: boolean
    isDirectMessage: boolean
    isSearching: boolean
}

const initialState: MessagesState = {
    messages: [],
    searchMessages: [],
    messageError: '',
    isMessageLoading: false,
    isDirectMessage: false,
    isSearching: false,
}

const saveMessageToDatabase = async (
    message: Message,
    currentChannel: ChannelInfo,
    isDirectChannel: boolean,
) => {
    let messageRef
    const messageCountRef = ref(database, `messageCount/${currentChannel.id}`)

    // Set messages destination based on public channel or private channel (direct messages)
    if (isDirectChannel) {
        messageRef = ref(
            database,
            `direct-message/${currentChannel.id}/messages/${message.id}`,
        )
    } else {
        messageRef = ref(
            database,
            `channels/${currentChannel.id}/messages/${message.id}`,
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
            uid: currentUser.uid,
            username: currentUser.username,
            photoUrl: currentUser.photoUrl,
        }

        // Create new message object to send to database
        const message: Message = {
            id: uuid(),
            timestamp: serverTimestamp(),
            content: data.message,
            media: data.mediaPath || '',
            createdBy,
        }

        await saveMessageToDatabase(message, currentChannel, isDirectMessage)

        // Cancel loading state
        dispatch(setMessageLoading(false))
    }
})

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        setMessages: (state, action) => {
            // Get message objects from action payload and convert to array
            if (action.payload) {
                const messages: Message[] = action.payload

                if (messages.length > 0) {
                    state.messages = messages
                }
            } else {
                state.messageError = 'EMPTY'
            }
        },
        setSearchMessages: (state, action) => {
            // Get message objects from action payload and convert to array
            if (action.payload) {
                const messages: Message[] = action.payload

                if (messages.length > 0) {
                    state.searchMessages = messages
                } else {
                    state.searchMessages = []
                }

                state.isSearching = true
            }
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload)
        },
        clearMessages: (state) => {
            state.messages = []
        },
        clearSearchMessage: (state) => {
            state.searchMessages = []

            state.isSearching = false
        },
        setMessageLoading: (state, action) => {
            state.isMessageLoading = action.payload
        },
    },
})

export const {
    setMessages,
    addMessage,
    clearMessages,
    setMessageLoading,
    setSearchMessages,
    clearSearchMessage,
} = messageSlice.actions

export const selectMessages = (state: RootState) => state.messages.messages
export const selectSearchMessages = (state: RootState) =>
    state.messages.searchMessages

export const selectMessagesError = (state: RootState) =>
    state.messages.messageError

export const selectIsMessageLoading = (state: RootState) =>
    state.messages.isMessageLoading

export const selectIsSearching = (state: RootState) =>
    state.messages.isSearching

export default messageSlice.reducer
