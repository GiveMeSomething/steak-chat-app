import { RootState } from 'redux/store'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { database } from 'firebase/firebase'
import { v4 as uuid } from 'uuid'
import { ref, set, update } from '@firebase/database'
import { UserInfo } from 'components/auth/redux/auth.slice'
import { ThunkState, Undefinable, WithPayload } from 'types/commonType'
import {
    clearOneChannelNotifications,
    setChannelNotifications,
    setOneChannelMessageCount,
} from './notification.slice'
import { remove } from 'firebase/database'
import { MESSAGE_COUNT_REF } from 'utils/databaseRef'

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

interface UpdateChannelInfoPayload {
    channelId: string
    content: string // This work with both channelName and channelDesc
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
    await set(MESSAGE_COUNT_REF, {
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
>('channels/star', async (channelInfo, { getState }) => {
    const appState = getState()
    const currentUser = appState.user.user

    // Save starred channel to starredChannels with userId as key
    const starredChannelRef = ref(
        database,
        `starredChannels/${currentUser?.uid}`,
    )
    await set(starredChannelRef, {
        [channelInfo.id]: true,
    })
})

export const unStarSelectedChannel = createAsyncThunk<
    void,
    ChannelInfo,
    ThunkState
>('channels/unstar', async (channelInfo, { getState }) => {
    const appState = getState()
    const currentUser = appState.user.user

    // Remove starred channel
    const starredChannelRef = ref(
        database,
        `starredChannels/${channelInfo.id}/${currentUser?.uid}`,
    )
    await remove(starredChannelRef)
})

export const updateNotifications = createAsyncThunk<
    any,
    ChannelIdAsKeyObject,
    ThunkState
>('channels/updateNotifications', async (data, { getState, dispatch }) => {
    const appState = getState()

    // Remote messageCount with channelId as key
    const channelIds = Object.keys(data)

    const currentChannel = appState.channels.currentChannel
    const messageCount = appState.notifications.messageCount

    // Check with last messageCount to update notifications
    channelIds.forEach((channelId) => {
        // Update notifications for non-currentChannel channel based on local messageCount and remote messageCount
        if (channelId !== currentChannel.id) {
            let notifications
            if (messageCount[channelId]) {
                notifications = data[channelId] - messageCount[channelId] // Use remote messageCount - local messageCount
            } else {
                notifications = data[channelId] // If local messageCount is empty -> notifications = remote messageCount
            }

            // Set channel notifications count
            dispatch(setChannelNotifications({ channelId, notifications }))
        } else {
            // Update local messageCount of currentChannel to remote messageCount
            dispatch(
                setOneChannelMessageCount({
                    channelId: channelId,
                    messageCount: data[channelId],
                }),
            )
        }
    })
})

export const updateChannelName = createAsyncThunk<
    void,
    UpdateChannelInfoPayload,
    ThunkState
>('channels/updateChannelName', async (data) => {
    const selectedChannelRef = ref(database, `channels/${data.channelId}`)
    await update(selectedChannelRef, { name: data.content })
})

export const updateChannelDesc = createAsyncThunk<
    void,
    UpdateChannelInfoPayload,
    ThunkState
>('channels/updateChannelDesc', async (data) => {
    const selectedChannelRef = ref(database, `channels/${data.channelId}`)
    await update(selectedChannelRef, { desc: data.content })
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
                const starredChannels = Object.keys(action.payload)

                // Traverse to remove channel from channels and add to starred
                let starredCount = 0
                let channelCount = 0
                while (starredCount < starredChannels.length) {
                    if (
                        state.channels[channelCount].id ===
                        starredChannels[starredCount]
                    ) {
                        state.starred.push(
                            state.channels.splice(channelCount, 1)[0],
                        )

                        starredCount++
                    }
                    channelCount++
                }
            }
        },
        addStarredChannel: (state, action) => {
            if (action.payload) {
                const starredChannelId = Object.keys(action.payload)[0]

                const starredChannelIndex = state.channels.findIndex(
                    (channel) => channel.id !== starredChannelId,
                )

                // Add channel to starred dropdown
                state.starred.push(
                    state.channels.splice(starredChannelIndex, 1)[0],
                )
            }
        },
        unStarChannel: (state, action) => {
            if (action.payload) {
                const starredChannelId = Object.keys(action.payload)[0]

                const starredChannelIndex = state.starred.findIndex(
                    (channel) => channel.id !== starredChannelId,
                )

                // Add channel to channel dropdown
                state.channels.push(
                    state.starred.splice(starredChannelIndex, 1)[0],
                )
            }
        },
        clearStarredChannel: (state) => {
            state.starred = []
        },

        updateChannelInfo: (state, action: WithPayload<ChannelInfo>) => {
            if (action.payload) {
                const updatedChannel = action.payload
                let isInChannelList = true

                // Find updatedChannel by id in channels list
                let selectedChannelIndex
                selectedChannelIndex = state.channels.findIndex(
                    (channel) => channel.id === updatedChannel.id,
                )

                // If not found, continue to find in starred list
                if (selectedChannelIndex < 0) {
                    selectedChannelIndex = state.starred.findIndex(
                        (channel) => channel.id === updatedChannel.id,
                    )
                    isInChannelList = false
                }

                if (selectedChannelIndex < 0) {
                    state.channelError = 'Updated Channel Not Found'
                } else {
                    if (isInChannelList) {
                        state.channels[selectedChannelIndex] = updatedChannel
                    } else {
                        state.starred[selectedChannelIndex] = updatedChannel
                    }
                }
            }
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
    updateChannelInfo,
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
