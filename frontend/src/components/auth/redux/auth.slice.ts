import { createSlice, isRejected, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from 'redux/store'

import { signin, signup, fetchUser, signout } from './auth.thunk'
import {
    updateUserStatus,
    updateUserProfile,
    updateUserAvatar
} from './user.thunk'

import { UserStatus } from 'types/appEnum'
import { IdAsKeyObject, Undefinable } from 'types/commonType'

// TODO: Maybe functions need to be in async/await
export interface UserInfo {
    uid: string
    username: string
    photoUrl: string
    email: string
    status?: UserStatus
    fullname?: string
    phonenumber?: string
    role?: string
    messageCount: IdAsKeyObject<number>
}

export interface EditableField {
    username?: string
    fullname?: string
    phonenumber?: string
    role?: string
}

export interface AuthPayload {
    email: string
    password: string
}
interface AuthSliceState {
    user: Undefinable<UserInfo>
    userError: Undefinable<string>
}

const initialState: AuthSliceState = {
    user: undefined,
    userError: undefined
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<UserInfo>) => {
            state.user = action.payload
        },
        setUserError: (state, action: PayloadAction<string>) => {
            state.userError = action.payload
        },
        removeCurrentUser: (state) => {
            state.user = undefined
        },
        removeUserError: (state) => {
            state.userError = undefined
        }
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

        builder.addCase(updateUserProfile.fulfilled, (state, action) => {
            if (state.user) {
                state.user = action.payload
            }
        })

        builder.addCase(updateUserAvatar.fulfilled, (state, action) => {
            if (state.user && action.payload) {
                state.user = { ...state.user, photoUrl: action.payload }
            }
        })

        builder.addMatcher(isRejected, (state, action) => {
            if (action.error.message) {
                state.userError = action.error.message
            } else {
                state.userError = 'Error occured in auth.slice'
            }
        })
    }
})

export const {
    setCurrentUser,
    removeCurrentUser,
    setUserError,
    removeUserError
} = userSlice.actions

export const selectCurrentUser = (state: RootState) => state.user.user

export default userSlice.reducer
