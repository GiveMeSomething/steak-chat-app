import { createAsyncThunk } from '@reduxjs/toolkit'

import { AuthPayload, UserInfo } from './auth.slice'
import { updateUserStatus } from './user.thunk'

import { firebaseApp } from 'firebase/firebase'
import { set, get, child } from 'firebase/database'
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    setPersistence,
    User,
    browserSessionPersistence
} from '@firebase/auth'

import { Undefinable, ThunkState } from 'types/commonType'
import { USERS_REF } from 'utils/databaseRef'
import { UserStatus } from 'types/appEnum'
import md5 from 'md5'

const auth = getAuth(firebaseApp)

async function initUserInfo(createdUser: User): Promise<void> {
    if (createdUser && createdUser.email) {
        const displayName = createdUser.email.split('@')[0]
        const photoURL = `https://gravatar.com/avatar/${md5(
            createdUser.email
        )}?d=identicon`

        const userRef = child(USERS_REF, createdUser.uid)

        // Update user info also update user status
        await set(userRef, {
            uid: createdUser.uid,
            username: displayName,
            email: createdUser.email,
            photoUrl: photoURL,
            status: UserStatus.ONLINE,
            messageCount: {}
        })
    }
}

export async function getUser(userId: string): Promise<UserInfo> {
    const userRef = child(USERS_REF, userId)
    const currentUser = await get(userRef)
    return currentUser.val()
}

export const signin = createAsyncThunk<Undefinable<UserInfo>, AuthPayload>(
    'user/signin',
    async (data, { dispatch }) => {
        await setPersistence(auth, browserSessionPersistence)
        const userCredential = await signInWithEmailAndPassword(
            auth,
            data.email,
            data.password
        )

        // Redux store's currentUser is not available at this time
        dispatch(
            updateUserStatus({
                userId: userCredential.user.uid,
                status: UserStatus.ONLINE
            })
        )

        return getUser(userCredential.user.uid)
    }
)

export const fetchUser = createAsyncThunk('user/fetchInfo', async () => {
    if (auth.currentUser) {
        return getUser(auth.currentUser.uid)
    }

    return undefined
})

export const signup = createAsyncThunk<Undefinable<UserInfo>, AuthPayload>(
    'user/signup',
    async (data, { dispatch }) => {
        await setPersistence(auth, browserSessionPersistence)
        const userCredential = await createUserWithEmailAndPassword(
            auth,
            data.email,
            data.password
        )

        // Redux store's currentUser is not available at this time
        await initUserInfo(userCredential.user)

        dispatch(
            updateUserStatus({
                userId: userCredential.user.uid,
                status: UserStatus.ONLINE
            })
        )

        return getUser(userCredential.user.uid)
    }
)

export const signout = createAsyncThunk<void, void, ThunkState>(
    'user/signOut',
    async (_, { getState, dispatch }) => {
        const currentUser = getState().user.user

        if (currentUser) {
            dispatch(
                updateUserStatus({
                    userId: currentUser.uid,
                    status: UserStatus.AWAY
                })
            )
        }

        await signOut(auth)
    }
)
