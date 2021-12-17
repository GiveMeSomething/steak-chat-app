import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'redux/store'
import { WithPayload } from 'types/commonType'
import { setCurrentChannel } from './channels.thunk'

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

export interface ChannelInfoPayload {
    channelName: string
    channelDesc: string
}

export interface UpdateChannelInfoPayload {
    channelId: string
    content: string // This work with both channelName and channelDesc
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
        name: ''
    },
    isDirectChannel: false,
    starred: []
}

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
                            state.channels.splice(channelCount, 1)[0]
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
                    (channel) => channel.id !== starredChannelId
                )

                // Add channel to starred dropdown
                state.starred.push(
                    state.channels.splice(starredChannelIndex, 1)[0]
                )
            }
        },
        unStarChannel: (state, action) => {
            if (action.payload) {
                const starredChannelId = Object.keys(action.payload)[0]

                const starredChannelIndex = state.starred.findIndex(
                    (channel) => channel.id !== starredChannelId
                )

                // Add channel to channel dropdown
                state.channels.push(
                    state.starred.splice(starredChannelIndex, 1)[0]
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
                    (channel) => channel.id === updatedChannel.id
                )

                // If not found, continue to find in starred list
                if (selectedChannelIndex < 0) {
                    selectedChannelIndex = state.starred.findIndex(
                        (channel) => channel.id === updatedChannel.id
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
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setCurrentChannel.fulfilled, (state, action) => {
            state.currentChannel = action.payload
        })
    }
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
    updateChannelInfo
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
