import { configureStore } from '@reduxjs/toolkit'

import authSlice from 'components/auth/redux/auth.slice'
import channelSlice from 'components/server/redux/channel.slice'
import channelMessageSlice from 'components/server/redux/channelMessage.slice'
import channelUsersSlice from 'components/server/redux/channelUsers.slice'
import metaPanelSlice from 'components/server/redux/metaPanel.slice'
import notificationSlice from 'components/server/redux/notification.slice'

export const store = configureStore({
    reducer: {
        user: authSlice,
        channels: channelSlice,
        messages: channelMessageSlice,
        channelUsers: channelUsersSlice,
        notifications: notificationSlice,
        metaPanelState: metaPanelSlice,
    },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
