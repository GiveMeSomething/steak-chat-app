import { createSlice } from '@reduxjs/toolkit'

import { RootState } from 'redux/store'

import { UserInfo } from 'components/auth/redux/auth.slice'
import { ChannelInfo } from 'components/server/redux/channels/channels.slice'

import { Undefinable, WithPayload } from 'types/commonType'

interface MetaPanelInitialState {
    isOpen: boolean
    isEditProfileOpen: boolean
    currentData: Undefinable<ChannelInfo | UserInfo>
}

const initialState: MetaPanelInitialState = {
    isOpen: false,
    isEditProfileOpen: false,
    currentData: undefined,
}

const metaPanelSlice = createSlice({
    name: 'metaPanelState',
    initialState,
    reducers: {
        setMetaPanelOpen: (state, action: WithPayload<boolean>) => {
            state.isOpen = action.payload
        },
        setEditProfileOpen: (state, action: WithPayload<boolean>) => {
            state.isEditProfileOpen = action.payload
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

export const selectIsEditProfileOpen = (state: RootState) =>
    state.metaPanelState.isEditProfileOpen

export const selectMetaPanelCurrentData = (state: RootState) =>
    state.metaPanelState.currentData

export const {
    setMetaPanelOpen,
    setEditProfileOpen,
    setCurrentMetaPanelData,
    clearCurrentMetaPanelData,
} = metaPanelSlice.actions

export default metaPanelSlice.reducer
