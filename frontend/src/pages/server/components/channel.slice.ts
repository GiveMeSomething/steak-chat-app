import { RootState } from 'redux/store'
import { createAsyncThunk, createSlice, isRejected } from '@reduxjs/toolkit'
import { database } from 'firebase/firebase'
import { v4 as uuid } from 'uuid'
import { ref, set } from '@firebase/database'

interface ChannelInfo {
    id?: string
    name?: string
    desc?: string
    createdBy: {
        uid?: string
        username?: string
    }
}

interface channelSliceInitialState {
    channels: ChannelInfo[]
    channelError: any,
    currentChannel: string,
}

const initalState: channelSliceInitialState = {
    channels: [],
    channelError: '',
    currentChannel: ''
}

export const addNewChannel = createAsyncThunk<
    ChannelInfo,
    any,
    { state: RootState }
>(
    'channels/create',
    async (
        data: { channelName: string; channelDesc: string },
        { getState },
    ) => {
        const state = getState().user

        const channelInfo: ChannelInfo = {
            id: uuid(),
            name: data.channelName,
            desc: data.channelDesc,
            createdBy: {
                uid: state.user?.uid,
                username: state.user?.displayName,
            },
        }

        await addChannelToDatabase(channelInfo)

        return channelInfo
    },
)

async function addChannelToDatabase({
    id,
    name,
    desc,
    createdBy,
}: ChannelInfo) {
    // This will overwrite data at the specified location
    await set(ref(database, `channels/${id}`), {
        id,
        name,
        desc,
        createdBy,
    })
}

const channelSlice = createSlice({
    name: 'channel',
    initialState: initalState,
    reducers: {
        setChannels: (state, action) => {
            state.channels = action.payload

            // Set current channel to first channel (if have any)
            if (state.channels[0].id) {
                state.currentChannel = state.channels[0].id
            }
        },
        addChannel: (state, action) => {
            state.channels = [...state.channels, action.payload]
        },
        setCurrentChannel: (state, action) => {
            state.currentChannel = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(isRejected, (state, action) => {
            state.channelError = action.error
        })
    },
})

export const { setChannels, addChannel, setCurrentChannel } = channelSlice.actions

export const selectChannels = (state: RootState) => state.channels

export default channelSlice.reducer
