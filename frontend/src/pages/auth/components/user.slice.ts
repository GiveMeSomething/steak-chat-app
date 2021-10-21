import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    updateProfile,
    signOut,
    User,
} from '@firebase/auth'
import { get, ref, set } from '@firebase/database'
import { database, firebaseApp } from 'firebase/firebase'
import { RootState } from 'redux/store'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import md5 from 'md5'
interface UserInfo {
    uid: string,
    displayName: string,
    photoUrl: string,
    email: string,
    status?: 'Online' | 'Away'
}

interface UserSliceState {
    user: UserInfo | null
    userError: any
}

const initialState: UserSliceState = {
    user: null,
    userError: null,
}

const auth = getAuth(firebaseApp)

// Login to existed user
export const signInAndSaveUser = createAsyncThunk(
    'user/signIn',
    async (data: { email: string; password: string }) => {
        const { user } = await signInWithEmailAndPassword(
            auth,
            data.email,
            data.password,
        )

        return getUserFromDatabase(user)
    },
)

// Create new user with display name and avatar from gravatar, and then save the info to database (Firebase's Realtime Database)
export const signUpAndSaveUser = createAsyncThunk(
    'user/signUp',
    async (data: { email: string; password: string }) => {
        const { user } = await createUserWithEmailAndPassword(
            auth,
            data.email,
            data.password,
        )

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

        return getUserFromDatabase(user)
    },
)

export const signOutAndRemoveUser = createAsyncThunk(
    'user/signOut',
    async () => {
        await signOut(getAuth(firebaseApp))
    }
)

async function updateUserToDatabase(createdUser: User) {
    await set(ref(database, 'users/' + createdUser.uid), {
        username: createdUser.displayName,
        email: createdUser.email,
        photoUrl: createdUser.photoURL,
    })
}

async function getUserFromDatabase(user: User) {
    const userSnapshot = await get(ref(database, 'users/' + user.uid))
    const userInfo: UserInfo = {
        uid: user.uid,
        email: userSnapshot.child('email').val(),
        photoUrl: userSnapshot.child('photoUrl').val(),
        displayName: userSnapshot.child('username').val(),
        status: 'Online'
    }

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
            state.user = null
        },
        setUserError: (state, action: PayloadAction<any>) => {
            state.userError = action.payload
        },
        removeUserError: (state) => {
            state.userError = null
        },
    },
    // TODO: See if this part can be refactored
    extraReducers: (builder) => {
        builder
            .addCase(signInAndSaveUser.fulfilled, (state, action) => {
                state.user = action.payload
            })
            .addCase(signInAndSaveUser.rejected, (state, action) => {
                state.userError = action.error
            })

        builder
            .addCase(signUpAndSaveUser.fulfilled, (state, action) => {
                state.user = action.payload
            })
            .addCase(signUpAndSaveUser.rejected, (state, action) => {
                state.userError = action.error
            })

        builder
            .addCase(signOutAndRemoveUser.fulfilled, (state) => {
                state.user = null
            })
            .addCase(signOutAndRemoveUser.rejected, (state, action) => {
                state.userError = action.error
            })
    },
})

export const {
    setCurrentUser,
    removeCurrentUser,
    setUserError,
    removeUserError,
} = userSlice.actions

export const selectCurrentUser = (state: RootState) => state.user

export default userSlice.reducer
