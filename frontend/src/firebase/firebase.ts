// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from 'firebase/app'
import { Database, getDatabase } from 'firebase/database'
import { FirebaseStorage, getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBAE_AUTH_DOMAIN,
    databaseUrl: process.env.REACT_APP_FIREBAE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
}

export const firebaseApp: FirebaseApp = initializeApp(firebaseConfig)

export const database: Database = getDatabase(firebaseApp)

export const storage: FirebaseStorage = getStorage(firebaseApp)
