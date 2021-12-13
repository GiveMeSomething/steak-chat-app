import { ref } from '@firebase/database'
import { database } from 'firebase/firebase'

export const CHANNELS_REF = ref(database, 'channels')

export const MESSAGE_COUNT_REF = ref(database, 'messageCount')

export const STARRED_REF = (uid?: string) =>
    ref(database, `starredChannels${uid ? `/${uid}` : ''}`)

export const USERS_REF = ref(database, 'users')

export const TYPING_REF = ref(database, 'typing')
