import React, { FunctionComponent } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'

import { selectCurrentUser } from 'components/auth/redux/auth.slice'
import { signout } from 'components/auth/redux/auth.thunk'

import { Dropdown } from 'semantic-ui-react'
import {
    setCurrentMetaPanelData,
    setMetaPanelOpen
} from '../metaPanel/redux/metaPanel.slice'

interface ProfileDropdownProps {}

const ProfileDropdown: FunctionComponent<ProfileDropdownProps> = () => {
    const dispatch = useAppDispatch()
    const currentUser = useAppSelector(selectCurrentUser)

    const menuOptions = {
        userProfile: {
            text: 'Profile'
        },
        userSetting: {
            text: 'Preferences',
            disabled: true
        },
        signout: {
            text: 'Sign out'
        }
    }

    const handleOnProfileClick = () => {
        if (currentUser) {
            dispatch(setCurrentMetaPanelData(currentUser))
            dispatch(setMetaPanelOpen(true))
        }
    }

    const handleOnSignoutClick = async () => {
        await dispatch(signout())
    }

    if (currentUser) {
        const { photoUrl, username, status } = currentUser
        return (
            <div className="ml-auto mx-4 bg-white rounded-md max-h-6 w-6">
                <Dropdown
                    trigger={
                        <span className="flex">
                            <img
                                src={photoUrl}
                                alt="avatar"
                                className="rounded-md"
                            />
                        </span>
                    }
                    icon={null}
                    id="user-settings"
                >
                    <Dropdown.Menu className="left text-black">
                        <div className="flex items-center justify-start m-4 pr-32">
                            <span className="flex">
                                <img
                                    className="max-h-12 w-12 rounded-md"
                                    src={photoUrl}
                                    alt="avt"
                                />
                            </span>
                            <div className="pl-4">
                                <h3 className="font-semibold">{username}</h3>
                            </div>
                            <h4>{status}</h4>
                        </div>
                        <Dropdown.Divider />
                        <Dropdown.Item
                            {...menuOptions.userProfile}
                            onClick={handleOnProfileClick}
                        />
                        <Dropdown.Item {...menuOptions.userSetting} />
                        <Dropdown.Divider />
                        <Dropdown.Item
                            {...menuOptions.signout}
                            onClick={handleOnSignoutClick}
                        />
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        )
    } else {
        // If currentUser not available, show an empty box as placeholder
        return (
            <div className="ml-auto mx-4 h-6 w-6 rounded-md bg-slack-text-blur" />
        )
    }
}

export default ProfileDropdown
