import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'redux/store'
import { IdAsKeyObject } from 'types/commonType'

interface NotificationSliceInititalState {
    messageCount: IdAsKeyObject<number>
    notifications: IdAsKeyObject<number>
}

const initialState: NotificationSliceInititalState = {
    messageCount: {},
    notifications: {}
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setChannelNotifications: (state, action) => {
            const { channelId, notifications } = action.payload
            state.notifications[channelId] = notifications
        },
        clearOneChannelNotifications: (state, action) => {
            const { channelId } = action.payload
            state.notifications[channelId] = 0
        },

        setChannelMessageCount: (state, action) => {
            if (action.payload) {
                state.messageCount = action.payload
            } else {
                // Avoid undefined
                state.messageCount = {}
            }
        },
        setOneChannelMessageCount: (state, action) => {
            const { channelId, messageCount } = action.payload
            state.messageCount[channelId] = messageCount
        }
    }
})

export const selectChannelNotifications = (state: RootState) =>
    state.notifications.notifications

export const selectChannelMessageCount = (state: RootState) =>
    state.notifications.messageCount

export const {
    setChannelMessageCount,
    setChannelNotifications,
    setOneChannelMessageCount,
    clearOneChannelNotifications
} = notificationSlice.actions

export default notificationSlice.reducer
