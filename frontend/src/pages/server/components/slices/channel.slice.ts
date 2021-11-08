import { RootState } from 'redux/store'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { database } from 'firebase/firebase'
import { v4 as uuid } from 'uuid'
import { ref, set } from '@firebase/database'
import { UserInfo } from 'pages/auth/components/auth.slice'
import { ThunkState, Undefinable } from 'types/commonType'

export interface ChannelInfo {
    id: string
    name: string
    desc?: string
    createdBy?: {
        uid?: string
        username?: string
        photoUrl?: string
    }
}

interface ChannelInfoPayload {
    channelName: string
    channelDesc: string
}

export interface ChannelIdAsKeyObject {
    [channelId: string]: number
}

interface channelSliceInitialState {
    channels: ChannelInfo[]
    channelError: any
    currentChannel: ChannelInfo
    isDirectChannel: boolean
    messageCount: ChannelIdAsKeyObject
    notifications: ChannelIdAsKeyObject
}

const initalState: channelSliceInitialState = {
    channels: [],
    channelError: '',
    currentChannel: {
        id: '',
        name: '',
    },
    isDirectChannel: false,
    messageCount: {},
    notifications: {},
}

const addChannelToDatabase = async ({
    id,
    name,
    desc,
    createdBy,
}: ChannelInfo) => {
    // This will overwrite data at the specified location
    await set(ref(database, `channels/${id}`), {
        id,
        name,
        desc,
        createdBy,
    })
}

const addChannelCountToDatabase = async ({ id }: ChannelInfo) => {
    await set(ref(database, 'messageCount'), {
        [id]: 0,
    })
}

const channelInfoFromUser = (
    data: ChannelInfoPayload,
    user: Undefinable<UserInfo>,
): ChannelInfo => ({
    id: uuid(),
    name: data.channelName,
    desc: data.channelDesc,
    createdBy: {
        uid: user?.uid,
        username: user?.username,
        photoUrl: user?.photoUrl,
    },
})

export const addNewChannel = createAsyncThunk<
    void,
    ChannelInfoPayload,
    ThunkState
>('channels/create', async (data: ChannelInfoPayload, { getState }) => {
    const channelInfo = channelInfoFromUser(data, getState().user.user)

    await addChannelToDatabase(channelInfo)

    await addChannelCountToDatabase(channelInfo)
})

export const updateNotifications = createAsyncThunk<
    any,
    ChannelIdAsKeyObject,
    ThunkState
>('channels/setNotifications', async (data, { getState }) => {
    const appState = getState()

    // Data is a object which key is channelId and value as messageCount
    const channelIds = Object.keys(data)

    const currentChannel = appState.channels.currentChannel
    const messageCount = appState.channels.messageCount
    const notifications = appState.channels.notifications
    const currentUser = appState.user.user

    // Check with last messageCount to update notifications
    channelIds.forEach((channelId) => {
        // Skip notification count for currentChannel
        if (channelId !== currentChannel.id) {
            if (messageCount[channelId]) {
                notifications[channelId] =
                    data[channelId] - messageCount[channelId]
            } else {
                notifications[channelId] = data[channelId]
            }
        }

        // Update current messageCount for all channels
        messageCount[channelId] = data[channelId]
    })

    // Save to status to users notifications
    await set(ref(database, `users/${currentUser?.uid}`), {
        lastMessageCount: messageCount,
    })
})

const channelSlice = createSlice({
    name: 'channel',
    initialState: initalState,
    reducers: {
        setChannels: (state, action) => {
            // Get property value as a channelInfo object
            // Firebase return object with channelId as property name
            if (action.payload) {
                state.channels = Object.values(action.payload)

                // Set current channel to first channel (if have any)
                if (state.channels[0].id) {
                    state.currentChannel = state.channels[0]
                }
            }
        },
        removeChannels: (state) => {
            state.channels = []
        },
        addChannel: (state, action) => {
            state.channels.push(action.payload)

            // Set first loaded channel as currenty active channel
            if (state.channels.length === 1) {
                state.currentChannel = state.channels[0]
            }
        },
        setCurrentChannel: (state, action) => {
            state.currentChannel = action.payload
        },
        setIsDirectChannel: (state, action) => {
            state.isDirectChannel = action.payload
        },
        setMessageCount: (state, action) => {
            if (action.payload) {
                state.messageCount = action.payload
            }
        },
    },
})

export const {
    setChannels,
    removeChannels,
    addChannel,
    setCurrentChannel,
    setIsDirectChannel,
    setMessageCount,
} = channelSlice.actions

// Select all channels
export const selectChannels = (state: RootState) => state.channels.channels

// Select currently selected channel, first channel by default
export const selectCurrentChannel = (state: RootState) =>
    state.channels.currentChannel

// Select isDirectMessage for logic check
export const selectIsDirectChannel = (state: RootState) =>
    state.channels.isDirectChannel

export default channelSlice.reducer
