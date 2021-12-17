import { configureStore } from '@reduxjs/toolkit'

import authSlice from 'components/auth/redux/auth.slice'
import channelSlice from 'components/server/redux/channels/channels.slice'
import channelMessageSlice from 'components/server/redux/messages/messages.slice'
import channelUsersSlice from 'components/server/redux/users/users.slice'
import metaPanelSlice from 'components/server/metaPanel/redux/metaPanel.slice'
import notificationSlice from 'components/server/redux/notifications/notifications.slice'

export const store = configureStore({
    reducer: {
        user: authSlice,
        channels: channelSlice,
        messages: channelMessageSlice,
        channelUsers: channelUsersSlice,
        notifications: notificationSlice,
        metaPanelState: metaPanelSlice
    }
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
