import { UserInfo } from 'components/auth/redux/auth.slice'
import { DropdownOptions } from 'types/semantic-ui-type'

export const MAX_FILE_SIZE_BYTES = 5 * 1000 * 1000
export const CHANNEL_NAME_SEPARATOR = '@'

// This does not contain '-'
export const BANNED_SPECIAL_CHARACTERS_REGEX =
    /^[!@#$%^&*()_+=[\]{};':"\\|,.<>/?]*$/

export const channelOptions = (starred: boolean): DropdownOptions[] => [
    {
        key: 'notifications/settings',
        text: 'Change notifications',
        value: 'notifications/settings',
        disabled: true,
    },
    {
        key: 'notifications/mute',
        text: 'Mute channel',
        value: 'notifications/mute',
        disabled: true,
    },
    {
        key: 'channel/copyName',
        text: 'Copy name',
        value: 'channel/copyName',
        disabled: true,
    },
    {
        key: 'channel/copyLink',
        text: 'Copy link',
        value: 'channel/copyLink',
        disabled: true,
    },
    {
        key: starred ? 'channel/unstar' : 'channel/star',
        text: starred ? 'Unstar channel' : 'Star channel',
        value: starred ? 'channel/unstar' : 'channel/star',
    },
    {
        key: 'channel/details',
        text: 'Open channel details',
        value: 'channel/details',
    },
    {
        key: 'channel/leave',
        text: 'Leave channel',
        value: 'channel/leave',
        disabled: true,
    },
]

export const userOptions: DropdownOptions[] = [
    {
        key: 'profile',
        text: 'Profile',
        value: 'profile',
        disabled: true,
    },
    {
        key: 'setting',
        text: 'Preferences',
        value: 'settings',
    },
    {
        key: 'signout',
        text: 'Sign out',
        value: 'signout',
    },
]

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
