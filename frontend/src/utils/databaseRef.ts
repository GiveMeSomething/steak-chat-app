import { ref } from '@firebase/database'
import { database } from 'firebase/firebase'

export const CHANNELS_REF = ref(database, 'channels')
export const DIRECT_MSG_REF = ref(database, 'direct-message')
export const MESSAGE_COUNT_REF = ref(database, 'messageCount')

// TODO: Refactor this
export const STARRED_REF = ref(database, 'starredChannels')

export const USERS_REF = ref(database, 'users')
export const TYPING_REF = ref(database, 'typing')
