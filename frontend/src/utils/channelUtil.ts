import { UserInfo } from 'components/auth/redux/auth.slice'
import { ChannelInfo } from 'components/server/redux/channels/channels.slice'
import { CHANNEL_NAME_SEPARATOR } from '../constants/appConst'

export const formatChannelName = (channelName: string) =>
    channelName.trim().replaceAll(' ', '-').toLowerCase()

export const getDirectChannelId = (currentUserId: string, userId: string) => {
    if (currentUserId) {
        // Create direct channel id based on userId and currentUser
        if (userId < currentUserId) {
            return `${userId}${CHANNEL_NAME_SEPARATOR}${currentUserId}`
        } else {
            return `${currentUserId}${CHANNEL_NAME_SEPARATOR}${userId}`
        }
    }

    // To avoid returning undefined
    // If there is no currentUser, the server should redirect to Login page
    return ''
}

export const generateDirectChannelInfo = (
    currentUser: UserInfo,
    channelId: string,
    toUser: string
) => {
    if (currentUser) {
        const directChannelInfo: ChannelInfo = {
            id: channelId,
            name: toUser,
            createdBy: {
                uid: currentUser.uid,
                username: currentUser.username,
                photoUrl: currentUser.photoUrl
            }
        }

        return directChannelInfo
    }
}

export const findChannelById = (
    channelId: string,
    channels: ChannelInfo[],
    starred: ChannelInfo[]
) => {
    let result = channels.find((channel) => channel.id === channelId)

    if (!result) {
        result = starred.find((channel) => channel.id === channelId)
    }

    return result
}
