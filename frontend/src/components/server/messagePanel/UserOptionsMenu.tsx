import { selectCurrentUser, UserInfo } from 'components/auth/redux/auth.slice'
import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'redux/hooks'
import { Dropdown, Ref } from 'semantic-ui-react'
import { messageUserOptions } from 'utils/appConst'
import {
    generateDirectChannelInfo,
    getDirectChannelId,
} from 'utils/channelUtil'
import { setIsDirectChannel, setCurrentChannel } from '../redux/channel.slice'

interface UserOptionsMenuProps {
    isOpen: boolean
    selectedUser: UserInfo
    openMetaPanel: Function
    closeMenu: Function
    dropdownStyle: Function
}

const UserOptionsMenu: FunctionComponent<UserOptionsMenuProps> = ({
    isOpen,
    selectedUser,
    openMetaPanel,
    closeMenu,
    dropdownStyle,
}) => {
    const [shouldMenuUpward, setShouldMenuUpward] = useState<boolean>(false)
    const optionMenuRef = useRef<HTMLDivElement>(null)

    const dispatch = useAppDispatch()

    const currentUser = useAppSelector(selectCurrentUser)

    const menuOptions = messageUserOptions(selectedUser)

    const directChannelId = (userId: string) => {
        if (currentUser) {
            return getDirectChannelId(currentUser.uid, userId)
        }

        return ''
    }

    // Calculate remaining space to display menu upward or downward
    // Run when the ref to menu is set
    useEffect(() => {
        if (optionMenuRef.current) {
            if (
                window.innerHeight -
                    optionMenuRef.current?.getBoundingClientRect().bottom <
                optionMenuRef.current?.scrollHeight
            ) {
                setShouldMenuUpward(true)
            }
        } else {
            setShouldMenuUpward(false)
        }
    }, [optionMenuRef])

    const handleOnViewProfileClick = (
        event: React.MouseEvent<HTMLDivElement>,
    ) => {
        openMetaPanel()
        closeMenu(event)
    }

    const handleOnMessageClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (currentUser) {
            const channelId = directChannelId(selectedUser.uid)
            const directChannelInfo = generateDirectChannelInfo(
                currentUser,
                channelId,
                selectedUser.username,
            )

            if (directChannelInfo) {
                dispatch(setIsDirectChannel(true))
                dispatch(setCurrentChannel(directChannelInfo))
            }
        }

        closeMenu(event)
    }

    return (
        <Dropdown
            icon={null}
            id="message-user-settings"
            open={isOpen}
            upward={shouldMenuUpward}
            className={dropdownStyle(shouldMenuUpward)}
        >
            <Ref innerRef={optionMenuRef}>
                <Dropdown.Menu>
                    {/* TODO: Currently hard-coding here */}
                    <Dropdown.Item
                        {...menuOptions[0]}
                        onClick={handleOnViewProfileClick}
                    />
                    <Dropdown.Divider />
                    <Dropdown.Item
                        {...menuOptions[1]}
                        onClick={handleOnMessageClick}
                    />
                    <Dropdown.Divider />
                    <Dropdown.Item {...menuOptions[2]} />
                    <Dropdown.Item {...menuOptions[3]} />
                </Dropdown.Menu>
            </Ref>
        </Dropdown>
    )
}

export default UserOptionsMenu
