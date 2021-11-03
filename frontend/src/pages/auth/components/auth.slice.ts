import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    updateProfile,
    signOut,
    setPersistence,
    User,
    browserSessionPersistence,
} from '@firebase/auth'
import { get, ref, set, update } from '@firebase/database'
import { database, firebaseApp } from 'firebase/firebase'
import { RootState } from 'redux/store'
import {
    createAsyncThunk,
    createSlice,
    isRejected,
    PayloadAction,
} from '@reduxjs/toolkit'
import md5 from 'md5'
import { UserStatus } from 'utils/appEnum'
import { Undefinable } from 'types/commonType'

// TODO: Maybe functions need to be in async/await
export interface UserInfo {
    uid: string
    username: string
    photoUrl: string
    email: string
    status?: UserStatus
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

const auth = getAuth(firebaseApp)

async function updateUserToDatabase(createdUser: User) {
    await set(ref(database, 'users/' + createdUser.uid), {
        uid: createdUser.uid,
        username: createdUser.displayName,
        email: createdUser.email,
        photoUrl: createdUser.photoURL,
        status: UserStatus.ONLINE,
    })
}

async function updateUserStatusToDatabase(userId: string, status: UserStatus) {
    await update(ref(database, 'users/' + userId), { status })
}

// Login to existed user
export const signInAndSaveUser = createAsyncThunk<
    Undefinable<UserInfo>,
    AuthPayload
>('user/signIn', async (data) => {
    await setPersistence(auth, browserSessionPersistence).then(() => {
        return signInWithEmailAndPassword(auth, data.email, data.password)
    })

    // This will have currentUser as it's waiting for above signIn
    if (auth.currentUser) {
        await updateUserStatusToDatabase(
            auth.currentUser?.uid,
            UserStatus.ONLINE,
        )
        return getUserFromDatabase(auth.currentUser?.uid)
    }

    return undefined
})

// Create new user with display name and avatar from gravatar, and then save the info to database (Firebase's Realtime Database)
export const signUpAndSaveUser = createAsyncThunk<
    Undefinable<UserInfo>,
    AuthPayload
>('user/signUp', async (data) => {
    await setPersistence(auth, browserSessionPersistence).then(() => {
        return createUserWithEmailAndPassword(auth, data.email, data.password)
    })

    // This will have currentUser as it's waiting for above signIn
    // Save the user to Firebase Realtime Database
    if (auth.currentUser && auth.currentUser.email) {
        await updateProfile(auth.currentUser, {
            displayName: auth.currentUser.email.split('@')[0],
            photoURL: `https://gravatar.com/avatar/${md5(
                auth.currentUser.email,
            )}?d=identicon`,
        })

        await updateUserToDatabase(auth.currentUser)
    }

    if (auth.currentUser) {
        return getUserFromDatabase(auth.currentUser?.uid)
    }

    return undefined
})

export const signOutAndRemoveUser = createAsyncThunk<
    void,
    void,
    { state: RootState }
>('user/signOut', async (_, { getState }) => {
    const currentUser = getState().user.user

    if (currentUser) {
        updateUserStatusToDatabase(currentUser.uid, UserStatus.AWAY)
    }

    await signOut(getAuth(firebaseApp))
})

export const fetchUser = createAsyncThunk('user/fetchInfo', async () => {
    if (auth.currentUser) {
        return getUserFromDatabase(auth.currentUser?.uid)
    }

    return undefined
})

export const updateUserStatus = createAsyncThunk<
    UserStatus,
    { user: UserInfo; status: UserStatus }
>('user/updateStatus', async ({ user, status }) => {
    await updateUserStatusToDatabase(user.uid, status)

    return status
})

async function getUserFromDatabase(uid: string) {
    const userSnapshot = await get(ref(database, `users/${uid}`))

    // const userInfo: UserInfo = {
    //     uid,
    //     email: userSnapshot.child('email').val(),
    //     photoUrl: userSnapshot.child('photoUrl').val(),
    //     username: userSnapshot.child('username').val(),
    //     status: userSnapshot.child('status').val(),
    // }

    const userInfo: UserInfo = userSnapshot.val()

    return userInfo
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
        builder.addCase(signInAndSaveUser.fulfilled, (state, action) => {
            state.user = action.payload
        })

        builder.addCase(signUpAndSaveUser.fulfilled, (state, action) => {
            state.user = action.payload
        })

        builder.addCase(fetchUser.fulfilled, (state, action) => {
            state.user = action.payload
        })

        builder.addCase(signOutAndRemoveUser.fulfilled, (state) => {
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
