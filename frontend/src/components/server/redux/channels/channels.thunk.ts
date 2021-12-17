import { createAsyncThunk } from '@reduxjs/toolkit'
import { set, ref, remove, update, get } from 'firebase/database'
import { database } from 'firebase/firebase'
import { v4 as uuid } from 'uuid'
import { ThunkState, IdAsKeyObject, Undefinable } from 'types/commonType'
import {
    setChannelNotifications,
    setOneChannelMessageCount,
    clearOneChannelNotifications
} from '../notifications/notifications.slice'
import {
    ChannelInfo,
    ChannelInfoPayload,
    UpdateChannelInfoPayload
} from './channels.slice'
import { MESSAGE_COUNT_REF } from 'utils/databaseRef'
import { UserInfo } from 'components/auth/redux/auth.slice'

const addChannel = async ({ id, name, desc, createdBy }: ChannelInfo) => {
    // This will overwrite data at the specified location
    await set(ref(database, `channels/${id}`), {
        id,
        name,
        desc,
        createdBy
    })
}

const addChannelCount = async (channelId: string) => {
    await set(MESSAGE_COUNT_REF, {
        [channelId]: 0
    })
}

const getChannelCount = async (channelId: string) => {
    const messageCountRef = ref(database, `messageCount/${channelId}`)
    const messageCount = await get(messageCountRef)

    return messageCount.val()
}

const channelInfoFromUser = (
    data: ChannelInfoPayload,
    user: Undefinable<UserInfo>
): ChannelInfo => ({
    id: uuid(),
    name: data.channelName,
    desc: data.channelDesc,
    createdBy: {
        uid: user?.uid,
        username: user?.username,
        photoUrl: user?.photoUrl
    }
})

export const addNewChannel = createAsyncThunk<
    void,
    ChannelInfoPayload,
    ThunkState
>('channels/create', async (data: ChannelInfoPayload, { getState }) => {
    const channelInfo = channelInfoFromUser(data, getState().user.user)

    await addChannel(channelInfo)
    await addChannelCount(channelInfo.id)
})

export const starSelectedChannel = createAsyncThunk<
    void,
    ChannelInfo,
    ThunkState
>('channels/star', async (channelInfo, { getState }) => {
    const appState = getState()
    const currentUser = appState.user.user

    // Save starred channel to starredChannels with userId as key
    const starredChannelRef = ref(
        database,
        `starredChannels/${currentUser?.uid}`
    )
    await set(starredChannelRef, {
        [channelInfo.id]: true
    })
})

export const unStarSelectedChannel = createAsyncThunk<
    void,
    ChannelInfo,
    ThunkState
>('channels/unstar', async (channelInfo, { getState }) => {
    const appState = getState()
    const currentUser = appState.user.user

    // Remove starred channel
    const starredChannelRef = ref(
        database,
        `starredChannels/${channelInfo.id}/${currentUser?.uid}`
    )
    await remove(starredChannelRef)
})

export const updateChannelName = createAsyncThunk<
    void,
    UpdateChannelInfoPayload,
    ThunkState
>('channels/updateChannelName', async (data) => {
    const selectedChannelRef = ref(database, `channels/${data.channelId}`)
    await update(selectedChannelRef, { name: data.content })
})

export const updateChannelDesc = createAsyncThunk<
    void,
    UpdateChannelInfoPayload,
    ThunkState
>('channels/updateChannelDesc', async (data) => {
    const selectedChannelRef = ref(database, `channels/${data.channelId}`)
    await update(selectedChannelRef, { desc: data.content })
})

export const setCurrentChannel = createAsyncThunk<
    ChannelInfo,
    ChannelInfo,
    ThunkState
>('channels/setCurrentChannel', async (data, { dispatch }) => {
    const currentMessageCount = await getChannelCount(data.id)

    // Update currentChannel messageCount to the lastest value
    dispatch(
        setOneChannelMessageCount({
            channelId: data.id,
            messageCount: currentMessageCount
        })
    )

    // Clear notifications of currentChannel
    dispatch(clearOneChannelNotifications({ channelId: data.id }))

    // Return this to set currentChannel as normal
    return data
})

export const updateNotifications = createAsyncThunk<
    any,
    IdAsKeyObject<number>,
    ThunkState
>('channels/updateNotifications', async (data, { getState, dispatch }) => {
    const appState = getState()

    // Remote messageCount with channelId as key
    const channelIds = Object.keys(data)

    const currentChannel = appState.channels.currentChannel
    const messageCount = appState.notifications.messageCount

    channelIds.forEach((channelId) => {
        // Check with last messageCount to update notifications
        // Update notifications for non-currentChannel channel based on local messageCount and remote messageCount
        if (channelId !== currentChannel.id) {
            const notifications =
                data[channelId] - (messageCount[channelId] || 0)

            // Set channel notifications count
            dispatch(setChannelNotifications({ channelId, notifications }))
        } else {
            // Update local messageCount of currentChannel to remote messageCount
            dispatch(
                setOneChannelMessageCount({
                    channelId: channelId,
                    messageCount: data[channelId]
                })
            )
        }
    })
})
