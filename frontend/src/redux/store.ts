import { configureStore } from '@reduxjs/toolkit'

import authSlice from 'components/auth/redux/auth.slice'
import channelSlice from 'pages/server/components/slices/channel.slice'
import messageSlice from 'pages/server/components/slices/channelMessage.slice'
import channelUsersSlice from 'pages/server/components/slices/channelUsers.slice'
import notificationSlice from 'pages/server/components/slices/notification.slice'
import metaPanelSlice from 'pages/server/components/slices/metaPanel.slice'

export const store = configureStore({
    reducer: {
        user: authSlice,
        channels: channelSlice,
        messages: messageSlice,
        channelUsers: channelUsersSlice,
        notifications: notificationSlice,
        metaPanelState: metaPanelSlice,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
