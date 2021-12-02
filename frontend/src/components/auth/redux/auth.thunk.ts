import { createAsyncThunk } from '@reduxjs/toolkit'
import { database, firebaseApp } from 'firebase/firebase'
import { ref, update, set, get } from 'firebase/database'
import {
    createUserWithEmailAndPassword,
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    setPersistence,
    User,
    browserSessionPersistence,
} from '@firebase/auth'

import md5 from 'md5'
import { Undefinable, ThunkState } from 'types/commonType'
import { AuthPayload, UserInfo } from './auth.slice'
import { UserStatus } from 'types/appEnum'

const auth = getAuth(firebaseApp)

const currentUserRef = (userId: string) => ref(database, `users/${userId}`)

async function updateUserInfo(createdUser: User) {
    if (createdUser && createdUser.email) {
        const displayName = createdUser.email.split('@')[0]
        const photoURL = `https://gravatar.com/avatar/${md5(
            createdUser.email,
        )}?d=identicon`

        // Update user info also update user status
        await set(currentUserRef(createdUser.uid), {
            uid: createdUser.uid,
            username: displayName,
            email: createdUser.email,
            photoUrl: photoURL,
            status: UserStatus.ONLINE,
            messageCount: {},
        })
    }
}

async function getUser(uid: string): Promise<UserInfo> {
    const currentUser = await get(currentUserRef(uid))
    return currentUser.val()
}

export const signin = createAsyncThunk<Undefinable<UserInfo>, AuthPayload>(
    'user/signin',
    async (data, { dispatch }) => {
        await setPersistence(auth, browserSessionPersistence).then(() => {
            return signInWithEmailAndPassword(auth, data.email, data.password)
        })

        // Redux store's currentUser is not available at this time
        if (auth.currentUser) {
            dispatch(
                updateUserStatus({
                    userId: auth.currentUser.uid,
                    status: UserStatus.ONLINE,
                }),
            )

            return getUser(auth.currentUser?.uid)
        }

        return undefined
    },
)

export const signup = createAsyncThunk<Undefinable<UserInfo>, AuthPayload>(
    'user/signup',
    async (data) => {
        await setPersistence(auth, browserSessionPersistence).then(() => {
            return createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password,
            )
        })

        // Redux store's currentUser is not available at this time
        if (auth.currentUser) {
            await updateUserInfo(auth.currentUser)

            return getUser(auth.currentUser?.uid)
        }

        return undefined
    },
)

export const signout = createAsyncThunk<void, void, ThunkState>(
    'user/signOut',
    async (_, { getState, dispatch }) => {
        const currentUser = getState().user.user

        if (currentUser) {
            dispatch(
                updateUserStatus({
                    userId: currentUser.uid,
                    status: UserStatus.AWAY,
                }),
            )
        }

        await signOut(auth)
    },
)

export const fetchUser = createAsyncThunk('user/fetchInfo', async () => {
    if (auth.currentUser) {
        return getUser(auth.currentUser?.uid)
    }

    return undefined
})

export const updateUserStatus = createAsyncThunk<
    UserStatus,
    { userId: string; status: UserStatus }
>('user/updateStatus', async ({ userId, status }) => {
    await update(currentUserRef(userId), { status })
    return status
})
