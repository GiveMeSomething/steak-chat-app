import React, { FunctionComponent } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { userOptions } from 'utils/appConst'

interface ProfileDropdownProps {
    username: string
    avatarUrl: string
    userStatus: string
    handleSignout: Function
}

const ProfileDropdown: FunctionComponent<ProfileDropdownProps> = ({
    username,
    avatarUrl,
    userStatus,
    handleSignout,
}) => {
    const userSettings = userOptions

    const onSignoutClick = () => {
        handleSignout()
    }

    return (
        <div className="ml-auto mx-4 bg-white rounded-md max-h-6 w-6">
            <Dropdown
                trigger={
                    <span className="flex">
                        <img src={avatarUrl} alt="avt" className="rounded-md" />
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
                                src={avatarUrl}
                                alt="avt"
                            />
                        </span>
                        <div className="pl-4">
                            <h3 className="font-semibold">{username}</h3>
                        </div>
                        <h4>{userStatus}</h4>
                    </div>
                    <Dropdown.Divider />
                    <Dropdown.Item {...userSettings[0]} />
                    <Dropdown.Item {...userSettings[1]} />
                    <Dropdown.Divider />
                    <Dropdown.Item
                        {...userSettings[2]}
                        onClick={onSignoutClick}
                    />
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )
}

export default ProfileDropdown
