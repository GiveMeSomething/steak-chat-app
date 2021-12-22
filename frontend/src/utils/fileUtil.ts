import { ref, uploadBytesResumable, UploadMetadata } from '@firebase/storage'
import { MAX_FILE_SIZE_BYTES } from 'constants/appConst'
import { storage } from 'firebase/firebase'
import { getDownloadURL } from 'firebase/storage'
import { useState } from 'react'
import { Undefinable } from 'types/commonType'

export function extractFileExt(fileName: string): string {
    const lastDotPos = fileName.lastIndexOf('.')
    return fileName.slice(lastDotPos)
}

// Check file size
export function isImageValid(imageFile: File): boolean {
    // Validate file size (by bytes)
    if (imageFile.size >= MAX_FILE_SIZE_BYTES) {
        return false
    }

    return true
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
        file: File | Blob,
        filePath: string,
        successCallback: (url: string) => void
    ) => {
        const storageRef = ref(storage, filePath)

        const storageMetadata: UploadMetadata = {
            cacheControl: 'public, max-age=8000' // About 2 hours
        }

        // Set current form states
        setUploadState('uploading')

        // Upload things
        const result = uploadBytesResumable(storageRef, file, storageMetadata)

        // Register three observers:
        // 1. 'state_changed' observer, called any time the state changes
        // 2. Error observer, called on failure
        // 3. Completion observer, called on successful completion
        result.on(
            'state_changed',
            (snapshot) => {
                // Watch progress to display a progress bar for better UX
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )

                // Set the state for UI update
                setUploadState(snapshot.state)
                setUploadProgress(progress)
            },
            (err: any) => {
                // TODO: Handle upload errors more specific if needed
                if (err.message) {
                    setUploadError(err.message)
                }
            },
            async () => {
                // If successfully uploaded, dispatch sendMessage to display and save message to database
                const imageUrl = await getDownloadURL(result.snapshot.ref)
                successCallback(imageUrl)
            }
        )
    }

    const resetState = () => {
        setUploadState(undefined)
        setUploadError(undefined)
        setUploadProgress(0)
    }

    return {
        startUpload,
        resetState,
        uploadState,
        uploadProgress,
        uploadError
    }
}
