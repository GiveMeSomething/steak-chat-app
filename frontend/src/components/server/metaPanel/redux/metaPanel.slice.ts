import { createSlice } from '@reduxjs/toolkit'

import { RootState } from 'redux/store'

import { UserInfo } from 'components/auth/redux/auth.slice'
import { ChannelInfo } from 'components/server/redux/channels/channels.slice'

import { Undefinable, WithPayload } from 'types/commonType'

interface MetaPanelInitialState {
    isOpen: boolean
    isEditProfileOpen: boolean
    currentData: Undefinable<ChannelInfo | UserInfo>
    channelDetailStartIndex?: 0 | 1 | 2
}

const initialState: MetaPanelInitialState = {
    isOpen: false,
    isEditProfileOpen: false,
    currentData: undefined,
    channelDetailStartIndex: undefined
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
            action: WithPayload<ChannelInfo | UserInfo>
        ) => {
            state.currentData = action.payload
        },
        clearCurrentMetaPanelData: (state) => {
            state.isOpen = false
            state.isEditProfileOpen = false
            state.channelDetailStartIndex = undefined
            state.currentData = undefined
        },
        setChannelDetailStartIndex: (
            state,
            action: WithPayload<'abouts' | 'members' | 'settings'>
        ) => {
            switch (action.payload) {
                case 'abouts':
                    state.channelDetailStartIndex = 0
                    break
                case 'members':
                    state.channelDetailStartIndex = 1
                    break
                case 'settings':
                    state.channelDetailStartIndex = 2
                    break
            }
        }
    }
})

export const selectIsMetaPanelOpen = (state: RootState) =>
    state.metaPanelState.isOpen

export const selectIsEditProfileOpen = (state: RootState) =>
    state.metaPanelState.isEditProfileOpen

export const selectMetaPanelCurrentData = (state: RootState) =>
    state.metaPanelState.currentData

export const selectChannelDetailsStartIndex = (state: RootState) =>
    state.metaPanelState.channelDetailStartIndex

export const {
    setMetaPanelOpen,
    setEditProfileOpen,
    setCurrentMetaPanelData,
    clearCurrentMetaPanelData,
    setChannelDetailStartIndex
} = metaPanelSlice.actions

export default metaPanelSlice.reducer
