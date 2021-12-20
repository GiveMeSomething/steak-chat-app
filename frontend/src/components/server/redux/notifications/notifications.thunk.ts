import { createAsyncThunk } from '@reduxjs/toolkit'
import { child, onDisconnect, remove, set } from 'firebase/database'
import { TYPING_REF } from 'utils/databaseRef'

interface TypingPayload {
    channelId: string
    userId: string
    username: string
}

export const setCurrentUserTyping = createAsyncThunk<void, TypingPayload>(
    'notification/setTyping',
    async ({ userId, channelId, username }) => {
        const userTypingRef = child(TYPING_REF, `${channelId}/${userId}`)
        await set(userTypingRef, username)

        onDisconnect(userTypingRef).remove()
    }
)

export const removeCurrentUserTyping = createAsyncThunk<
    void,
    Pick<TypingPayload, 'userId' | 'channelId'>
>('notification/setTyping', async ({ userId, channelId }) => {
    const userTypingRef = child(TYPING_REF, `${channelId}/${userId}`)
    await remove(userTypingRef)
})
