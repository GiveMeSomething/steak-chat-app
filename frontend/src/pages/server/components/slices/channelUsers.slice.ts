import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'redux/store'

import { Undefinable } from 'types/commonType'
import { UserInfo } from 'pages/auth/components/auth.slice'

interface channelUsersSliceInitialState {
    users: UserInfo[]
    currentUser: Undefinable<UserInfo>
    userError: string
}
const initialState: channelUsersSliceInitialState = {
    users: [],
    currentUser: undefined,
    userError: '',
}

const channelUsersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setChannelUsers: (state, action) => {
            state.users = action.payload
        },
        addChannelUser: (state, action) => {
            state.users.push(action.payload)
        },
    },
})

export const { addChannelUser } = channelUsersSlice.actions

export const selectChannelUsers = (state: RootState) => state.channelUsers.users

export default channelUsersSlice.reducer
