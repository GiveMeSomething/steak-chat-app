import { createSlice } from '@reduxjs/toolkit'
import { UserInfo } from 'components/auth/redux/auth.slice'
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
        setMetaPanelOpen: (state, action: WithPayload<boolean>) => {
            state.isOpen = action.payload
        },
        setCurrentMetaPanelData: (
            state,
            action: WithPayload<ChannelInfo | UserInfo>,
        ) => {
            state.currentData = action.payload
        },
        clearCurrentMetaPanelData: (state) => {
            state.currentData = undefined
        },
    },
})

export const selectIsMetaPanelOpen = (state: RootState) =>
    state.metaPanelState.isOpen

export const selectMetaPanelCurrentData = (state: RootState) =>
    state.metaPanelState.currentData

export const {
    setMetaPanelOpen,
    setCurrentMetaPanelData,
    clearCurrentMetaPanelData,
} = metaPanelSlice.actions

export default metaPanelSlice.reducer
