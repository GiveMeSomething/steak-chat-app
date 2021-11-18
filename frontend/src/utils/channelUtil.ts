import { UserInfo } from 'pages/auth/components/auth.slice'
import { ChannelInfo } from 'pages/server/components/slices/channel.slice'
import { CHANNEL_NAME_SEPARATOR } from './appConst'

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
    toUser: string,
) => {
    if (currentUser) {
        const directChannelInfo: ChannelInfo = {
            id: channelId,
            name: toUser,
            createdBy: {
                uid: currentUser.uid,
                username: currentUser.username,
                photoUrl: currentUser.photoUrl,
            },
        }

        return directChannelInfo
    }
}
