import { signOutAndRemoveUser } from 'pages/auth/components/user.slice'
import React, { FunctionComponent } from 'react'
import { useAppDispatch } from 'redux/hooks'
import { Dropdown } from 'semantic-ui-react'
import { DropdownOptions } from 'types/semantic-ui-type'

const ServerLayout: FunctionComponent = () => {
    const dispatch = useAppDispatch()

    const userSettings: DropdownOptions[] = [
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

    const handleSignout = async () => {
        await dispatch(signOutAndRemoveUser())
    }

    return (
        <div className="fullscreen text-white overflow-hidden">
            <div className="w-full bg-slack-navbar py-3 max-h-15">
                <div className="flex items-center justify-center">
                    <input
                        type="text"
                        className="bg-slack-searchbar w-2/5 text-slack-text-light col-start-2 absolute placeholder-white px-4"
                        placeholder="Search something in ..."
                    />
                    <div className="ml-auto mx-4 bg-white rounded-md max-h-8 w-8">
                        <Dropdown
                            trigger={
                                <span className="flex">
                                    <img src="/logo192.png" />
                                </span>
                            }
                            icon={null}
                            id="userSetting"
                        >
                            <Dropdown.Menu className="left text-black">
                                <div className="flex items-center justify-start m-4 pr-32">
                                    <div className="h-8 w-8 bg-black p-2"></div>
                                    <div className="p-2">
                                        <h4 className="font-semibold">
                                            Username
                                        </h4>
                                        <h5 className="font-light">Status</h5>
                                    </div>
                                </div>
                                <Dropdown.Divider />
                                <Dropdown.Item {...userSettings[0]} />
                                <Dropdown.Item {...userSettings[1]} />
                                <Dropdown.Divider />
                                <Dropdown.Item
                                    {...userSettings[2]}
                                    onClick={handleSignout}
                                />
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-12 fullsize">
                <div className="col-span-2 fullsize bg-slack-sidebar-normal">
                    <div className="flex items-center justify-between p-2 border-t-2 border-b-2 border-opacity-90 border-gray-700">
                        <h2>#Name</h2>
                        <h2>Gear</h2>
                    </div>
                </div>
                <div className="col-span-10 w-full h-full bg-white text-gray-800">
                    Messages
                </div>
            </div>
        </div>
    )
}

export default ServerLayout
