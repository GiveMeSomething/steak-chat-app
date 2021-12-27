import { createAsyncThunk } from '@reduxjs/toolkit'
import { setCurrentMetaPanelData } from 'components/server/metaPanel/redux/metaPanel.slice'
import { update, onDisconnect, child } from 'firebase/database'
import { UserStatus } from 'types/appEnum'
import { ThunkState } from 'types/commonType'
import { USERS_REF } from 'utils/databaseRef'
import { EditableField, UserInfo } from './auth.slice'
import { getUser } from './auth.thunk'

interface UpdateUserPayload extends EditableField {
    userId: string
}

export const updateUserStatus = createAsyncThunk<
    UserStatus,
    { userId: string; status: UserStatus }
>('user/updateStatus', async ({ userId, status }) => {
    const userRef = child(USERS_REF, userId)
    await update(userRef, { status })

    // Change user status when user exit app
    onDisconnect(child(userRef, 'status')).set(UserStatus.AWAY)
    return status
})

export const updateUserAvatar = createAsyncThunk<
    string,
    { userId: string; photoUrl: string },
    ThunkState
>('user/updateAvatar', async ({ userId, photoUrl }, { getState, dispatch }) => {
    const appState = getState()

    const userRef = child(USERS_REF, userId)
    await update(userRef, { photoUrl })

    // Update currentData for metaPanel if open (currently editing profile)
    if (appState.metaPanelState.isOpen) {
        if (appState.user.user) {
            dispatch(
                setCurrentMetaPanelData({ ...appState.user.user, photoUrl })
            )
        }
    }

    return photoUrl
})

export const updateUserProfile = createAsyncThunk<UserInfo, UpdateUserPayload>(
    'user/updateProfile',
    async (data) => {
        const { userId, ...updateInfo } = data
        const userRef = child(USERS_REF, userId)

        await update(userRef, { ...updateInfo })
        return getUser(userId)
    }
)
