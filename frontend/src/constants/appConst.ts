import { Crop } from 'react-image-crop'

export const MAX_FILE_SIZE_BYTES = 5 * 1000 * 1000 // 5MB
export const CHANNEL_NAME_SEPARATOR = '@' // Direct channel name = user1.username + separator + user2.username

// This does not contain '-'
export const BANNED_SPECIAL_CHARACTERS_REGEX =
    /^[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]*$/

export const VIETNAMESE_PHONENUM_REGEX = /(84|0[3|5|7|8|9])+([0-9]{8})\b/

export const MENU_HEIGHT = 13 * 16 // ~13rem
export const CARD_HEIGHT = 22 * 16 // ~18rem

export const cropSetting: Partial<Crop> = {
    aspect: 1,
    unit: '%',
    width: 100
}
