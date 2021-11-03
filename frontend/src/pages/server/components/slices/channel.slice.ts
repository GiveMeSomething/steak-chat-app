import { RootState } from 'redux/store'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { database } from 'firebase/firebase'
import { v4 as uuid } from 'uuid'
import { ref, set } from '@firebase/database'
import { UserInfo } from 'pages/auth/components/auth.slice'
import { Undefinable } from 'types/commonType'

export interface ChannelInfo {
    id: string
    name: string
    desc?: string
    createdBy?: {
        uid?: string
        username?: string
    }
}

interface ChannelInfoPayload {
    channelName: string
    channelDesc: string
}

interface channelSliceInitialState {
    channels: ChannelInfo[]
    channelError: any
    currentChannel: ChannelInfo
    isDirectChannel: boolean
}

const initalState: channelSliceInitialState = {
    channels: [],
    channelError: '',
    currentChannel: {
        id: '',
        name: '',
    },
    isDirectChannel: false,
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
    },
})

export const addNewChannel = createAsyncThunk<
    void,
    ChannelInfoPayload,
    { state: RootState }
>('channels/create', async (data: ChannelInfoPayload, { getState }) => {
    const channelInfo = channelInfoFromUser(data, getState().user.user)

    await addChannelToDatabase(channelInfo)
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
        },
        setCurrentChannel: (state, action) => {
            state.currentChannel = action.payload
        },
        setIsDirectChannel: (state, action) => {
            state.isDirectChannel = action.payload
        },
    },
})

export const {
    setChannels,
    removeChannels,
    addChannel,
    setCurrentChannel,
    setIsDirectChannel,
} = channelSlice.actions

// Select all channels
export const selectChannels = (state: RootState) => state.channels.channels

// Select currently selected channel, first channel by default
export const selectCurrentChannel = (state: RootState) =>
    state.channels.currentChannel

// Select isDirectMessage for logic check
export const isDirectChannel = (state: RootState) =>
    state.channels.isDirectChannel

export default channelSlice.reducer
