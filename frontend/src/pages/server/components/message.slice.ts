import { get, ref, serverTimestamp, set } from '@firebase/database'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { database } from 'firebase/firebase'
import { RootState } from 'redux/store'
import { v4 as uuid } from 'uuid'

interface Message {
    id: string
    content: string
    timestamp: object
    createdBy: {
        uid?: string,
        username?: string,
        photoUrl?: string
    }
}

interface MessagesState {
    messages: Message[] | null
    messageError: string | 'EMPTY',
    isMessageLoading: boolean,
}

const initialState: MessagesState = {
    messages: null,
    messageError: '',
    isMessageLoading: false,
}

export const sendMessage = createAsyncThunk<any, any, { state: RootState }>(
    'message/send',
    async (data, { getState, dispatch }) => {
        const currentUser = getState().user.user

        if (currentUser) {
            const createdBy = {
                uid: currentUser.uid,
                username: currentUser.displayName,
                photoUrl: currentUser.photoUrl,
            }

            // Create new message object to send to database
            const message: Message = {
                id: uuid(),
                timestamp: serverTimestamp(),
                content: data.content,
                createdBy,
            }

            const messageRef = ref(database, `channels/${data.channel}/messages/${message.id}`)
            // Set object to database, this will trigger child_added to re-render page
            await set(messageRef, message)

            const result = await get(messageRef)

            // Cancel loading state
            dispatch(setMessageLoading(false))

            // Return value to add to store
            return result.val()
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
            if (action.payload) {
                const messages: Message[] = action.payload

                if (messages.length > 0) {
                    state.messages = messages
                }
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
        setMessageLoading: (state, action) => {
            state.isMessageLoading = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(sendMessage.fulfilled, (state, action) => {
            if (state.messages) {
                state.messages = [...state.messages, action.payload]
            } else {
                state.messages = [action.payload]
            }
        })
    }
})

export const { setMessages, addMessage, setMessageLoading } = messageSlice.actions

export const selectMessages = (state: RootState) => state.messages.messages
export const selectMessagesError = (state: RootState) => state.messages.messageError
export const isMessageLoading = (state: RootState) => state.messages.isMessageLoading

export default messageSlice.reducer
