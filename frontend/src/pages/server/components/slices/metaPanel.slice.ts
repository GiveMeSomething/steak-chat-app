import { createSlice } from '@reduxjs/toolkit'
import { UserInfo } from 'pages/auth/components/auth.slice'
import { RootState } from 'redux/store'
import { Undefinable, WithPayload } from 'types/commonType'
import { ChannelInfo } from './channel.slice'

interface MetaPanelInitialState {
    isOpen: boolean
    currentData: Undefinable<ChannelInfo | UserInfo>
}

const initialState: MetaPanelInitialState = {
    isOpen: false,
    currentData: undefined,
}

const metaPanelSlice = createSlice({
    name: 'metaPanelState',
    initialState,
    reducers: {
        setOpen: (state, action: WithPayload<boolean>) => {
            state.isOpen = action.payload
        },
        setCurrentData: (
            state,
            action: WithPayload<ChannelInfo | UserInfo>,
        ) => {
            state.currentData = action.payload
        },
    },
})

export const selectIsMetaPanelOpen = (state: RootState) =>
    state.metaPanelState.isOpen

export const selectMetaPanelCurrentData = (state: RootState) =>
    state.metaPanelState.currentData

export const { setOpen, setCurrentData } = metaPanelSlice.actions

export default metaPanelSlice.reducer
