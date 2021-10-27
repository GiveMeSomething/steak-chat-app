import { ref, serverTimestamp, set } from '@firebase/database'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { database } from 'firebase/firebase'
import { RootState } from 'redux/store'
import { v4 as uuid } from 'uuid'

interface Message {
    id: string
    content: string
    timestamp: object
    createdBy: {
        uid?: string
        username?: string
    }
}

interface MessagesState {
    messages: Message[] | null
    messageError: string | 'EMPTY'
}

const initialState: MessagesState = {
    messages: null,
    messageError: '',
}

export const sendMessage = createAsyncThunk<any, any, { state: RootState }>(
    'message/send',
    async (data, { getState }) => {
        const currentUser = getState().user.user

        if (currentUser) {
            const createdBy = {
                uid: currentUser.uid,
                photoUrl: currentUser.photoUrl,
            }

            // Create new message object to send to database
            const message: Message = {
                id: uuid(),
                timestamp: serverTimestamp(),
                content: data.content,
                createdBy,
            }

            // Set object to database, this will trigger child_added to re-render page
            await set(
                ref(database, `channels/${data.channel}/messages/${message.id}`),
                message,
            )

            return message
        }

        return null
    },
)

const messageSlice = createSlice({
    name: 'message',
    initialState,
    reducers: {
        setMessages: (state, action) => {
            // Get message objects from action payload and convert to array
            const messages: Message[] = Object.values(action.payload)

            if (messages.length > 0) {
                state.messages = messages
            } else {
                state.messageError = 'EMPTY'
            }
        },
        addMessage: (state, action) => {
            if (state.messages) {
                state.messages = [...state.messages, action.payload]
            } else {
                state.messages = [action.payload]
            }
        },
    },
    extraReducers: (builder) => {
        builder.addCase(sendMessage.fulfilled, (state, action) => {
            if (state.messages) {
                state.messages = [...state.messages, action.payload]
            } else {
                state.messages = [action.payload]
            }
        })
    },
})

export const { setMessages, addMessage } = messageSlice.actions

export default messageSlice.reducer
