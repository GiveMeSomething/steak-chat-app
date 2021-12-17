import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'redux/store'
import { Undefinable } from 'types/commonType'

export interface Message {
    id: string
    content: string
    timestamp: object
    media: Undefinable<string>
    createdBy: {
        uid: string
    }
}

export interface SendMessagePayload {
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
    isSearching: false
}

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
        }
    }
})

export const {
    setMessages,
    addMessage,
    clearMessages,
    setMessageLoading,
    setSearchMessages,
    clearSearchMessage
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
