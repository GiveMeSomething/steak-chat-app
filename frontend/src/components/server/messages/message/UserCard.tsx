import { selectCurrentUser, UserInfo } from 'components/auth/redux/auth.slice'
import React, { FunctionComponent } from 'react'
import { useAppSelector } from 'redux/hooks'
import { Button, Dropdown, Icon } from 'semantic-ui-react'

interface UserCardProps {
    isOpen: boolean
    selectedUser: UserInfo
    openMetaPanel: Function
    closeMenu: Function
    cardStyle: string
    upward: boolean
}

const UserCard: FunctionComponent<UserCardProps> = ({
    isOpen,
    cardStyle,
    upward,
}) => {
    const currentUser = useAppSelector(selectCurrentUser)

    if (currentUser) {
        const { username, photoUrl, status } = currentUser
        return (
            <Dropdown
                icon={null}
                id="message-user-settings"
                open={isOpen}
                upward={upward}
                className={cardStyle}
            >
                <Dropdown.Menu>
                    <div className="flex flex-col ">
                        <span className="flex max-w-36 max-h-36 overflow-hidden">
                            <img
                                className="w-full h-full rounded-md"
                                src={photoUrl}
                                alt="avt"
                            />
                        </span>
                        <div className="m-4">
                            <div className="flex items-center">
                                <h1 className="font-semibold">{username}</h1>
                                <Icon
                                    name="circle"
                                    color="green"
                                    size="small"
                                    className="m-2"
                                />
                            </div>
                            {status && <h4>{status}</h4>}
                            <p className="text-slack-sidebar-focus hover:underline cursor-pointer my-6">
                                View full profile
                            </p>
                            <p className="text-slack-sidebar-focus hover:underline cursor-pointer my-6">
                                Set a status
                            </p>
                            <div className="flex items-center justify-between gap-2 mt-4">
                                <Button
                                    basic
                                    className="font-semibold px-8 py-4"
                                >
                                    Set Status
                                </Button>
                                <Button
                                    color="red"
                                    className="font-semibold px-8 py-4"
                                >
                                    Edit Profile
                                </Button>
                            </div>
                        </div>
                    </div>
                </Dropdown.Menu>
            </Dropdown>
        )
    } else {
        return null
    }
}

export default UserCard
