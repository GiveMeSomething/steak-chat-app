import { RootState } from 'redux/store'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { database } from 'firebase/firebase'
import { v4 as uuid } from 'uuid'
import { ref, set } from '@firebase/database'
import { UserInfo } from 'pages/auth/components/auth.slice'
import { ThunkState, Undefinable } from 'types/commonType'
import {
    clearOneChannelNotifications,
    setChannelNotifications,
    setOneChannelMessageCount,
} from './notification.slice'
import { remove } from 'firebase/database'

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

interface ChannelSliceInitialState {
    channels: ChannelInfo[]
    channelError: any
    currentChannel: ChannelInfo
    isDirectChannel: boolean
    starred: ChannelInfo[]
}

const initalState: ChannelSliceInitialState = {
    channels: [],
    channelError: '',
    currentChannel: {
        id: '',
        name: '',
    },
    isDirectChannel: false,
    starred: [],
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

export const starSelectedChannel = createAsyncThunk<
    void,
    ChannelInfo,
    ThunkState
>('channels/star', async (channelInfo) => {
    // Save starred to database
    const starredChannelRef = ref(database, `starredChannels/${channelInfo.id}`)
    await set(starredChannelRef, channelInfo)
})

export const unStarSelectedChannel = createAsyncThunk<
    void,
    ChannelInfo,
    ThunkState
>('channel/unstar', async (channelInfo) => {
    // Remove starred channel
    const starredChannelRef = ref(database, `starredChannels/${channelInfo.id}`)
    await remove(starredChannelRef)
})

export const updateNotifications = createAsyncThunk<
    any,
    ChannelIdAsKeyObject,
    ThunkState
>('channels/updateNotifications', async (data, { getState, dispatch }) => {
    const appState = getState()

    // Data is a object which key is channelId and value as messageCount
    const channelIds = Object.keys(data)

    const currentChannel = appState.channels.currentChannel
    const messageCount = appState.notifications.messageCount

    // TODO: Clear notifications when change to that channel
    // Check with last messageCount to update notifications
    channelIds.forEach((channelId) => {
        // Skip notification count for currentChannel
        if (channelId !== currentChannel.id) {
            if (messageCount[channelId]) {
                const notifications = data[channelId] - messageCount[channelId]

                dispatch(setChannelNotifications({ channelId, notifications }))
            } else {
                const notifications = data[channelId]
                dispatch(setChannelNotifications({ channelId, notifications }))
            }
        } else {
            dispatch(
                setOneChannelMessageCount({
                    channelId: channelId,
                    messageCount: data[channelId],
                }),
            )
        }
    })
})

export const setCurrentChannel = createAsyncThunk<
    ChannelInfo,
    ChannelInfo,
    ThunkState
>('channels/setCurrentChannel', async (data, { getState, dispatch }) => {
    const appState = getState()

    const channelMessageCount = appState.notifications.messageCount
    const channelNotifications = appState.notifications.notifications

    // Update messageCount for currentChannel
    // Message count can be calculated as current messageCount + number of notifications of that channel
    if (channelMessageCount && channelNotifications) {
        console.log(data.id)

        // Prevent NaN when a channel does not exist in notifications or messageCount
        const messageCount = channelMessageCount[data.id]
            ? channelMessageCount[data.id]
            : 0
        const notificationCount = channelNotifications[data.id]
            ? channelNotifications[data.id]
            : 0

        const currentMessageCount = messageCount + notificationCount

        // Update currentChannel messageCount to the lastest value
        dispatch(
            setOneChannelMessageCount({
                channelId: data.id,
                messageCount: currentMessageCount,
            }),
        )

        // Clear notifications of currentChannel
        dispatch(clearOneChannelNotifications({ channelId: data.id }))
    }

    // Return this to set currentChannel as normal
    return data
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
        addChannel: (state, action) => {
            state.channels.push(action.payload)

            // Set first loaded channel as currenty active channel
            if (state.channels.length === 1) {
                state.currentChannel = state.channels[0]
            }
        },
        clearChannels: (state) => {
            state.channels = []
        },

        setIsDirectChannel: (state, action) => {
            state.isDirectChannel = action.payload
        },

        setStarredChannels: (state, action) => {
            // Get property value as a channelInfo object
            // Firebase return object with channelId as property name
            if (action.payload) {
                state.starred = Object.values(action.payload)
            }
        },
        addStarredChannel: (state, action: { payload: ChannelInfo }) => {
            if (action.payload) {
                state.channels = state.channels.filter(
                    (channel) => channel.id !== action.payload.id,
                )

                // Add channel to starred dropdown
                state.starred.push(action.payload)
            }
        },
        unStarChannel: (state, action: { payload: ChannelInfo }) => {
            if (action.payload) {
                state.starred = state.starred.filter(
                    (channel) => channel.id !== action.payload.id,
                )

                // Add channel to channel dropdown
                state.channels.push(action.payload)
            }
        },
        clearStarredChannel: (state) => {
            state.starred = []
        },
    },
    extraReducers: (builder) => {
        builder.addCase(setCurrentChannel.fulfilled, (state, action) => {
            state.currentChannel = action.payload
        })
    },
})

export const {
    setChannels,
    clearChannels,
    addChannel,
    setIsDirectChannel,
    setStarredChannels,
    addStarredChannel,
    clearStarredChannel,
    unStarChannel,
} = channelSlice.actions

// Select all channels
export const selectChannels = (state: RootState) => state.channels.channels

// Select all starred channels
export const selectStarredChannels = (state: RootState) =>
    state.channels.starred

// Select currently selected channel, first channel by default
export const selectCurrentChannel = (state: RootState) =>
    state.channels.currentChannel

// Select isDirectMessage for logic check
export const selectIsDirectChannel = (state: RootState) =>
    state.channels.isDirectChannel

export default channelSlice.reducer
