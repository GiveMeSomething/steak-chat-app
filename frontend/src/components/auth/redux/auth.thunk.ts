import { createAsyncThunk } from '@reduxjs/toolkit'

import {
    AuthPayload,
    EditableField,
    updateAvatar,
    UserInfo
} from './auth.slice'

import { database, firebaseApp } from 'firebase/firebase'
import { ref, update, set, get, DatabaseReference } from 'firebase/database'
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
import { UserStatus } from 'types/appEnum'
import md5 from 'md5'
import { setCurrentMetaPanelData } from 'components/server/metaPanel/redux/metaPanel.slice'

const auth = getAuth(firebaseApp)

const userRef = (userId: string): DatabaseReference =>
    ref(database, `users/${userId}`)

async function initUserInfo(createdUser: User): Promise<void> {
    if (createdUser && createdUser.email) {
        const displayName = createdUser.email.split('@')[0]
        const photoURL = `https://gravatar.com/avatar/${md5(
            createdUser.email
        )}?d=identicon`

        // Update user info also update user status
        await set(userRef(createdUser.uid), {
            uid: createdUser.uid,
            username: displayName,
            email: createdUser.email,
            photoUrl: photoURL,
            status: UserStatus.ONLINE,
            messageCount: {}
        })
    }
}

// Accept both userId or reference as parameter
async function getUser(userId: string): Promise<UserInfo> {
    const currentUser = await get(userRef(userId))
    return currentUser.val()
}

export const updateUserStatus = createAsyncThunk<
    UserStatus,
    { userId: string; status: UserStatus }
>('user/updateStatus', async ({ userId, status }) => {
    await update(userRef(userId), { status })
    return status
})

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
                    status: UserStatus.ONLINE
                })
            )

            return getUser(auth.currentUser?.uid)
        }

        return undefined
    }
)

export const signup = createAsyncThunk<Undefinable<UserInfo>, AuthPayload>(
    'user/signup',
    async (data) => {
        await setPersistence(auth, browserSessionPersistence).then(() => {
            return createUserWithEmailAndPassword(
                auth,
                data.email,
                data.password
            )
        })

        // Redux store's currentUser is not available at this time
        if (auth.currentUser) {
            await initUserInfo(auth.currentUser)

            return getUser(auth.currentUser?.uid)
        }

        return undefined
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

export const fetchUser = createAsyncThunk('user/fetchInfo', async () => {
    if (auth.currentUser) {
        return getUser(auth.currentUser?.uid)
    }

    return undefined
})

export const updateUserAvatar = createAsyncThunk<
    void,
    { userId: string; photoUrl: string },
    ThunkState
>('user/updateAvatar', async ({ userId, photoUrl }, { getState, dispatch }) => {
    const appState = getState()

    await update(userRef(userId), { photoUrl })

    // Set currentUser avatar
    dispatch(updateAvatar(photoUrl))

    // update currentData for metaPanel if it is open (currently editing profile)
    if (appState.metaPanelState.isOpen) {
        if (appState.user.user) {
            dispatch(
                setCurrentMetaPanelData({ ...appState.user.user, photoUrl })
            )
        }
    }
})

interface UpdateUserPayload extends EditableField {
    userId: string
}

export const updateUserProfile = createAsyncThunk<UserInfo, UpdateUserPayload>(
    'user/updateProfile',
    async (data) => {
        const { userId, ...updateInfo } = data

        const updatedUserRef = userRef(userId)

        await update(updatedUserRef, { ...updateInfo })

        const updatedUser = await get(updatedUserRef)
        return updatedUser.val()
    }
)
