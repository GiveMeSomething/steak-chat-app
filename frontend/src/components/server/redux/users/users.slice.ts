import { createSlice } from '@reduxjs/toolkit'
import { RootState } from 'redux/store'

import { Undefinable } from 'types/commonType'
import { UserInfo } from 'components/auth/redux/auth.slice'

interface channelUsersSliceInitialState {
    users: UserInfo[]
    currentUser: Undefinable<UserInfo>
    userError: string
}
const initialState: channelUsersSliceInitialState = {
    users: [],
    currentUser: undefined,
    userError: ''
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
        updateChannelUser: (state, action) => {
            const updatedUser: UserInfo = action.payload
            const index = state.users.findIndex(
                (user) => user.uid === updatedUser.uid
            )

            state.users[index] = updatedUser
        },
        clearChannelUsers: (state) => {
            state.users = []
        }
    }
})

export const {
    setChannelUsers,
    addChannelUser,
    clearChannelUsers,
    updateChannelUser
} = channelUsersSlice.actions

export const selectChannelUsers = (state: RootState) => state.channelUsers.users

export default channelUsersSlice.reducer
