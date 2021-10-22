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
import { get, ref, set } from '@firebase/database'
import { database, firebaseApp } from 'firebase/firebase'
import { RootState } from 'redux/store'
import {
    createAsyncThunk,
    createSlice,
    isRejected,
    PayloadAction,
} from '@reduxjs/toolkit'
import md5 from 'md5'

// TODO: Maybe functions need to be in async/await
interface UserInfo {
    uid: string
    displayName: string
    photoUrl: string
    email: string
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
        setPersistence(auth, browserSessionPersistence).then(() => {
            return signInWithEmailAndPassword(auth, data.email, data.password)
        })

        if (auth.currentUser) {
            return getUserFromDatabase(auth.currentUser?.uid)
        } else {
            throw new Error('Cannot create new user')
        }
    },
)

// Create new user with display name and avatar from gravatar, and then save the info to database (Firebase's Realtime Database)
export const signUpAndSaveUser = createAsyncThunk(
    'user/signUp',
    async (data: { email: string; password: string }) => {
        setPersistence(auth, browserSessionPersistence).then(() => {
            return createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password,
            )
        })

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
        } else {
            throw new Error('Cannot create new user')
        }
    },
)

export const signOutAndRemoveUser = createAsyncThunk(
    'user/signOut',
    async () => {
        await signOut(getAuth(firebaseApp))
    },
)

export const fetchUser = createAsyncThunk(
    'user/fetchInfo',
    async (data: { uid: string }) => {
        return getUserFromDatabase(data.uid)
    },
)

async function updateUserToDatabase(createdUser: User) {
    await set(ref(database, 'users/' + createdUser.uid), {
        username: createdUser.displayName,
        email: createdUser.email,
        photoUrl: createdUser.photoURL,
    })
}

async function getUserFromDatabase(uid: string) {
    const userSnapshot = await get(ref(database, `users/${uid}`))
    const userInfo: UserInfo = {
        uid,
        email: userSnapshot.child('email').val(),
        photoUrl: userSnapshot.child('photoUrl').val(),
        displayName: userSnapshot.child('username').val(),
        status: 'Online',
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
            state.user = null
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

export const selectCurrentUser = (state: RootState) => state.user

export default userSlice.reducer
