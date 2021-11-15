import { ref } from '@firebase/database'
import { database } from 'firebase/firebase'

export const CHANNELS_REF = ref(database, 'channels')

export const MESSAGE_COUNT_REF = ref(database, 'messageCount')

export const STARRED_REF = ref(database, 'starredChannels')

export const USERS_REF = ref(database, 'users')
