import { createSlice } from '@reduxjs/toolkit'
<<<<<<<< HEAD:frontend/src/components/server/metaPanel/redux/metaPanel.slice.ts
========
import { UserInfo } from 'components/auth/redux/auth.slice'
>>>>>>>> e62bf9a05d3423286aeb5ccd161f0190c06f8c50:frontend/src/components/server/redux/metaPanel.slice.ts
import { RootState } from 'redux/store'

import { UserInfo } from 'components/auth/redux/auth.slice'
import { ChannelInfo } from 'components/server/redux/channels/channels.slice'

import { Undefinable, WithPayload } from 'types/commonType'
<<<<<<<< HEAD:frontend/src/components/server/metaPanel/redux/metaPanel.slice.ts
========
import { ChannelInfo } from './channels/channels.slice'
>>>>>>>> e62bf9a05d3423286aeb5ccd161f0190c06f8c50:frontend/src/components/server/redux/metaPanel.slice.ts

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
