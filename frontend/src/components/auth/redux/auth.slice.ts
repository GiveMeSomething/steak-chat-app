import { RootState } from 'redux/store'
import { createSlice, isRejected, PayloadAction } from '@reduxjs/toolkit'
import { UserStatus } from 'utils/appEnum'
import { ChannelIdAsKeyObject } from 'pages/server/components/slices/channel.slice'
import { Undefinable } from 'types/commonType'
import {
    signin,
    signup,
    fetchUser,
    signout,
    updateUserStatus,
} from './auth.thunk'

// TODO: Maybe functions need to be in async/await
export interface UserInfo {
    uid: string
    username: string
    photoUrl: string
    email: string
    status?: UserStatus
    messageCount: ChannelIdAsKeyObject
}

export interface AuthPayload {
    email: string
    password: string
}
interface AuthSliceState {
    user: Undefinable<UserInfo>
    userError: any
}

const initialState: AuthSliceState = {
    user: undefined,
    userError: undefined,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<any>) => {
            state.user = action.payload
        },
        removeCurrentUser: (state) => {
            state.user = undefined
        },
        setUserError: (state, action: PayloadAction<any>) => {
            state.userError = action.payload
        },
        removeUserError: (state) => {
            state.userError = undefined
        },
    },
    // TODO: See if this part can be refactored
    extraReducers: (builder) => {
        builder.addCase(signin.fulfilled, (state, action) => {
            state.user = action.payload
        })

        builder.addCase(signup.fulfilled, (state, action) => {
            state.user = action.payload
        })

        builder.addCase(fetchUser.fulfilled, (state, action) => {
            state.user = action.payload
        })

        builder.addCase(signout.fulfilled, (state) => {
            state.user = undefined
        })

        builder.addCase(updateUserStatus.fulfilled, (state, action) => {
            if (state.user) {
                state.user = { ...state.user, status: action.payload }
            }
        })

        builder.addMatcher(isRejected, (state, action) => {
            state.userError = action.error.message
        })
    },
})

export const {
    setCurrentUser,
    removeCurrentUser,
    setUserError,
    removeUserError,
} = userSlice.actions

export const selectCurrentUser = (state: RootState) => state.user.user

export default userSlice.reducer
