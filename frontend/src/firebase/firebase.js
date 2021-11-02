// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: 'AIzaSyAE2c2oGEs6lCS8iK7zWtBDpeo9l6f04_8',
    authDomain: 'steak-chat-app-79f80.firebaseapp.com',
    projectId: 'steak-chat-app-79f80',
    storageBucket: 'steak-chat-app-79f80.appspot.com',
    messagingSenderId: '579962188919',
    appId: '1:579962188919:web:53176ceceb85fc0e040272',
}

export const firebaseApp = initializeApp(firebaseConfig)

export const database = getDatabase(firebaseApp)

export const storage = getStorage(firebaseApp)
