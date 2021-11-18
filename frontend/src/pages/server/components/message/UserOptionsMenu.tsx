import { UserInfo } from 'pages/auth/components/auth.slice'
import React, { FunctionComponent, useEffect, useRef, useState } from 'react'
import { Dropdown, Ref } from 'semantic-ui-react'
import { messageUserOptions } from 'utils/appConst'

interface UserOptionsMenuProps {
    isOpen: boolean
    selectedUser: UserInfo
    showAtUsername?: boolean
}

const UserOptionsMenu: FunctionComponent<UserOptionsMenuProps> = ({
    isOpen,
    selectedUser,
    showAtUsername = false,
}) => {
    const [shouldMenuUpward, setShouldMenuUpward] = useState<boolean>(false)
    const optionMenuRef = useRef<HTMLDivElement>(null)

    const menuOptions = messageUserOptions(selectedUser)

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

    return (
        <Dropdown
            icon={null}
            id="message-user-settings"
            open={isOpen}
            upward={shouldMenuUpward}
            className={
                !showAtUsername && shouldMenuUpward
                    ? 'z-20 top-6 -left-6'
                    : 'z-20 top-6 -left-6'
            }
        >
            <Ref innerRef={optionMenuRef}>
                <Dropdown.Menu>
                    {/* TODO: Currently hard-coding here */}
                    <Dropdown.Item {...menuOptions[0]} />
                    <Dropdown.Divider />
                    <Dropdown.Item {...menuOptions[1]} />
                    <Dropdown.Divider />
                    <Dropdown.Item {...menuOptions[2]} />
                    <Dropdown.Item {...menuOptions[3]} />
                </Dropdown.Menu>
            </Ref>
        </Dropdown>
    )
}

export default UserOptionsMenu
