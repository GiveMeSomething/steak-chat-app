import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'redux/store'
import { IdAsKeyObject, WithPayload } from 'types/commonType'

interface NotificationSliceInititalState {
    messageCount: IdAsKeyObject<number>
    notifications: IdAsKeyObject<number>
    typing: IdAsKeyObject<string>
}

const initialState: NotificationSliceInititalState = {
    messageCount: {},
    notifications: {},
    typing: {}
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setChannelNotifications: (
            state,
            action: WithPayload<{
                channelId: string
                notifications: number
            }>
        ) => {
            const { channelId, notifications } = action.payload
            state.notifications[channelId] = notifications
        },
        clearOneChannelNotifications: (
            state,
            action: WithPayload<{ channelId: string }>
        ) => {
            const { channelId } = action.payload
            state.notifications[channelId] = 0
        },

        setChannelMessageCount: (
            state,
            action: WithPayload<IdAsKeyObject<number>>
        ) => {
            if (action.payload) {
                state.messageCount = action.payload
            } else {
                // Avoid undefined
                state.messageCount = {}
            }
        },
        setOneChannelMessageCount: (
            state,
            action: WithPayload<{
                channelId: string
                messageCount: number
            }>
        ) => {
            const { channelId, messageCount } = action.payload
            state.messageCount[channelId] = messageCount
        },

        // Typer work only on currentChannel, will be clear when change channel
        addTyper: (
            state,
            action: WithPayload<{ userId: string; username: string }>
        ) => {
            if (action.payload) {
                const { userId, username } = action.payload
                state.typing[userId] = username
            }
        },
        removeTyper: (state, action: WithPayload<{ userId: string }>) => {
            if (action.payload) {
                const { userId } = action.payload
                delete state.typing[userId]
            }
        },
        clearTyper: (state) => {
            state.typing = {}
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
    clearOneChannelNotifications,
    addTyper,
    removeTyper,
    clearTyper
} = notificationSlice.actions

export const selectTyper = (state: RootState) => state.notifications.typing

export default notificationSlice.reducer
