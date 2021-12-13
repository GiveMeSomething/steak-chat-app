import { createAsyncThunk } from '@reduxjs/toolkit'
import { child, remove, set } from 'firebase/database'
import { TYPING_REF } from 'utils/databaseRef'

interface TypingPayload {
    channelId: string
    userId: string
}

type TypingStatus = 'typing' | 'remove'

const updateUserTypingStatus = async (
    type: TypingStatus,
    { channelId, userId }: TypingPayload,
) => {
    const channelTypingRef = child(TYPING_REF, `${channelId}`)
    const userTypingRef = child(channelTypingRef, `${userId}`)

    switch (type) {
        case 'typing':
            set(userTypingRef, true)
            break
        case 'remove':
            remove(userTypingRef)
            break
        default:
            break
    }
    await set(userTypingRef, true)
}

export const setCurrentUserTyping = createAsyncThunk<void, TypingPayload>(
    'notification/setTyping',
    async (data) => {
        updateUserTypingStatus('typing', data)
    },
)

export const removeCurrentUserTyping = createAsyncThunk<void, TypingPayload>(
    'notification/setTyping',
    async (data) => {
        updateUserTypingStatus('remove', data)
    },
)
