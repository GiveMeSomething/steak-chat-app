import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, User } from '@firebase/auth'
import { ref, set } from '@firebase/database'
import { database, firebaseApp } from '@firebase/firebase'
import { RootState } from '@redux/store'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import md5 from 'md5'

interface UserSliceState {
    user: User | null,
    userError: any
}

const initialState: UserSliceState = {
    user: null,
    userError: null
}

// Login to existed user
export const logInAndSaveUser = createAsyncThunk('user/logIn', async (data: {email: string, password: string}, thunkAPI) => {
    const auth = getAuth(firebaseApp)
    const user = await signInWithEmailAndPassword(auth, data.email, data.password)

    return user.user
})

// Create new user with display name and avatar from gravatar, and then save the info to database (Firebase's Realtime Database)
export const signUpAndSaveUser = createAsyncThunk('user/signUp', async (data: {email: string, password: string}, thunkAPI) => {
    const auth = getAuth(firebaseApp)
    const user = await createUserWithEmailAndPassword(auth, data.email, data.password)

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

    return user.user
})

async function updateUserToDatabase(createdUser: User) {
    await set(ref(database, 'users/' + createdUser.uid), {
        username: createdUser.displayName,
        email: createdUser.email,
        photoUrl: createdUser.photoURL,
    })
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCurrentUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload
        },
        removeCurrentUser: (state) => {
            state.user = null
        },
        setUserError: (state, action:PayloadAction<any>) => {
            state.userError = action.payload
        },
        removeUserError: (state) => {
            state.userError = null
        }
    },
    extraReducers: (builder) => {
        builder.addCase(logInAndSaveUser.fulfilled, (state, action) => {
            state.user = action.payload
        }).addCase(logInAndSaveUser.rejected, (state, action) => {
            state.userError = action.error
        })

        builder.addCase(signUpAndSaveUser.fulfilled, (state, action) => {
            state.user = action.payload
        })
    }
})

export const { setCurrentUser, removeCurrentUser, setUserError, removeUserError } = userSlice.actions

export const selectCurrentUser = (state: RootState) => state.user

export default userSlice.reducer
