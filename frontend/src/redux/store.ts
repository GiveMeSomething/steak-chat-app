import { configureStore } from '@reduxjs/toolkit'

import authSlice from 'pages/auth/components/auth.slice'
import channelSlice from 'pages/server/components/slices/channel.slice'
import messageSlice from 'pages/server/components/slices/channelMessage.slice'
import channelUsersSlice from 'pages/server/components/slices/channelUsers.slice'

export const store = configureStore({
    reducer: {
        user: authSlice,
        channels: channelSlice,
        messages: messageSlice,
        channelUsers: channelUsersSlice
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
