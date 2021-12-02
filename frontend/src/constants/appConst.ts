export const MAX_FILE_SIZE_BYTES = 5 * 1000 * 1000 // 5MB
export const CHANNEL_NAME_SEPARATOR = '@' // Direct channel name = user1.username + separator + user2.username

// This does not contain '-'
export const BANNED_SPECIAL_CHARACTERS_REGEX =
    /^[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]*$/
