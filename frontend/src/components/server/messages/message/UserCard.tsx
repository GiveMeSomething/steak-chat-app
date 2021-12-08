import React, { FunctionComponent } from 'react'

import { selectCurrentUser, UserInfo } from 'components/auth/redux/auth.slice'

import { Button, Dropdown } from 'semantic-ui-react'
import { useAppSelector } from 'redux/hooks'
import StatusIcon from 'components/commons/StatusIcon'

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
    selectedUser,
    openMetaPanel,
    closeMenu,
    cardStyle,
    upward,
}) => {
    const currentUser = useAppSelector(selectCurrentUser)

    const handleOnViewProfileClick = (
        event: React.MouseEvent<HTMLDivElement>,
    ): void => {
        openMetaPanel(selectedUser)
        closeMenu(event)
    }

    const { username, photoUrl, status } = selectedUser
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
                            <StatusIcon
                                userStatus={selectedUser.status}
                                size="small"
                                className="m-2"
                            />
                        </div>
                        {status && <h4>{status}</h4>}
                        <p
                            className="text-slack-sidebar-focus hover:underline cursor-pointer my-6"
                            onClick={handleOnViewProfileClick}
                        >
                            View full profile
                        </p>
                        {currentUser?.uid === selectedUser.uid ? (
                            <>
                                <p className="text-slack-sidebar-focus hover:underline cursor-pointer my-6">
                                    Set a status
                                </p>
                                <div className="grid grid-cols-2 gap-2 mt-4">
                                    <div className="col-span-1">
                                        <Button
                                            basic
                                            className="font-semibold w-full"
                                        >
                                            Set a status
                                        </Button>
                                    </div>
                                    <div className="col-span-1">
                                        <Button
                                            color="red"
                                            className="font-semibold w-full"
                                        >
                                            Edit profile
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                <div className="col-span-1">
                                    <Button
                                        basic
                                        className="font-semibold w-full"
                                    >
                                        Message
                                    </Button>
                                </div>
                                <div className="col-span-1">
                                    <Button
                                        basic
                                        className="font-semibold w-full"
                                    >
                                        Call
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default UserCard
