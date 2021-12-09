import { ref, uploadBytesResumable } from '@firebase/storage'
import { storage } from 'firebase/firebase'
import { getDownloadURL } from 'firebase/storage'
import { useState } from 'react'
import { Undefinable } from 'types/commonType'
import { v4 as uuid } from 'uuid'

export function extractFileExt(fileName: string): string {
    const lastDotPos = fileName.lastIndexOf('.')
    return fileName.slice(lastDotPos)
}

// Refs: https://firebase.google.com/docs/storage/web/upload-files#manage_uploads
// Upload user image to Firebase storage and save message to Redux store
export function useUploadFile() {
    const [uploadState, setUploadState] =
        useState<Undefinable<string>>(undefined)
    const [uploadError, setUploadError] =
        useState<Undefinable<string>>(undefined)
    const [uploadProgress, setUploadProgress] = useState<number>(0)

    const startUpload = async (
        file: File,
        successCallback: (url: string) => void,
    ) => {
        const storageFilePath = `chat/public/${uuid()}.${extractFileExt(
            file.name,
        )}`
        const storageRef = ref(storage, storageFilePath)

        // Set current form states
        setUploadState('uploading')

        // Upload things
        const result = uploadBytesResumable(storageRef, file)

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        result.on(
            'state_changed',
            (snapshot) => {
                // Watch progress to display a progress bar for better UX
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
                )
                setUploadProgress(progress)

                // Set the state for according UI update
                setUploadState(snapshot.state)
            },
            (err: any) => {
                // TODO: Handle upload errors more specific if needed
                if (err.message) {
                    setUploadError(err.message)
                }
            },
            async () => {
                // If successfully uploaded, dispatch sendMessage to display and save message to database
                getDownloadURL(result.snapshot.ref).then(async (downloadUrl) =>
                    successCallback(downloadUrl),
                )
            },
        )
    }

    return {
        startUpload,
        uploadState,
        uploadProgress,
        uploadError,
    }
}
