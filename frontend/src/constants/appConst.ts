import { UserInfo } from 'components/auth/redux/auth.slice'
import { DropdownOptions } from 'types/semantic-ui-type'

export const MAX_FILE_SIZE_BYTES = 5 * 1000 * 1000
export const CHANNEL_NAME_SEPARATOR = '@'

// This does not contain '-'
export const BANNED_SPECIAL_CHARACTERS_REGEX =
    /^[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]*$/

export const messageUserOptions = (user: UserInfo): DropdownOptions[] => [
    {
        key: 'profile',
        text: 'View profile',
        value: 'profile',
    },
    {
        key: 'message',
        text: `Message ${user.username}`,
        value: 'settings',
    },
    {
        key: 'copyName',
        text: 'Copy name',
        value: 'copyName',
        disabled: true,
    },
    {
        key: 'copyLink',
        text: 'Copy link',
        value: 'copyLink',
        disabled: true,
    },
]
