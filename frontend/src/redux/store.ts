import userSlice from '../pages/auth/components/user.slice'
import { configureStore } from '@reduxjs/toolkit'
import channelSlice from 'pages/server/components/channel.slice'
import messageSlice from 'pages/server/components/message.slice'

export const store = configureStore({
    reducer: {
        user: userSlice,
        channels: channelSlice,
        messages: messageSlice,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
