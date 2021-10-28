import { RootState } from 'redux/store'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { database } from 'firebase/firebase'
import { v4 as uuid } from 'uuid'
import { ref, set } from '@firebase/database'
import { UserInfo } from 'pages/auth/components/user.slice'

export interface ChannelInfo {
    id?: string
    name?: string
    desc?: string
    createdBy: {
        uid?: string
        username?: string
    }
}

interface ChannelInfoPayload {
    channelName: string,
    channelDesc: string
}

interface channelSliceInitialState {
    channels: ChannelInfo[]
    channelError: any
    currentChannel: string
}

const initalState: channelSliceInitialState = {
    channels: [],
    channelError: '',
    currentChannel: '',
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

const channelInfoFromUser = (data: ChannelInfoPayload, user: UserInfo | null): ChannelInfo => ({
    id: uuid(),
    name: data.channelName,
    desc: data.channelDesc,
    createdBy: {
        uid: user?.uid,
        username: user?.displayName,
    },
})

export const addNewChannel = createAsyncThunk<any, any, { state: RootState }>(
    'channels/create',
    async (
        data: { channelName: string; channelDesc: string },
        { getState },
    ) => {
        const channelInfo = channelInfoFromUser(data, getState().user.user)

        await addChannelToDatabase(channelInfo)
    },
)

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
                    // TODO: Find a better way to solve this problem
                    state.currentChannel = state.channels[0].id
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
    }
})

export const { setChannels, removeChannels, addChannel, setCurrentChannel } =
    channelSlice.actions

export const selectChannels = (state: RootState) => state.channels

export const selectCurrentChannel = (state: RootState) =>
    state.channels.currentChannel

export default channelSlice.reducer
