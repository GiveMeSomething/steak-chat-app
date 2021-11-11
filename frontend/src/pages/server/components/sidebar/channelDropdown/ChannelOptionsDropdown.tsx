import React, { FunctionComponent } from 'react'
import { useAppDispatch } from 'redux/hooks'
import { Dropdown, Icon } from 'semantic-ui-react'
import { channelOptions } from 'utils/appConst'
import {
    ChannelInfo,
    unStarSelectedChannel,
    starSelectedChannel,
} from '../../slices/channel.slice'

interface ChannelOptionsDropdownProps {
    starred: boolean
    selectedChannel: ChannelInfo | undefined
    isOpen: boolean
    closeDropdown: Function
}

const ChannelOptionsDropdown: FunctionComponent<ChannelOptionsDropdownProps> =
    ({ starred, isOpen, selectedChannel, closeDropdown }) => {
        const dispatch = useAppDispatch()

        const dropdownOptions = channelOptions(starred)

        const handleOnStarChannel = async (
            event: React.MouseEvent<HTMLDivElement>,
        ) => {
            if (selectedChannel) {
                if (starred) {
                    await dispatch(unStarSelectedChannel(selectedChannel))
                } else {
                    await dispatch(starSelectedChannel(selectedChannel))
                }
            }
            closeDropdown(event)
        }

        return (
            <Dropdown
                icon={null}
                id="userSetting"
                trigger={<Icon name="ellipsis horizontal" />}
                open={isOpen}
            >
                {/* Currently hard-coding here */}
                <Dropdown.Menu className="right text-black text-xl font-light">
                    <Dropdown.Item {...dropdownOptions[0]} />
                    <Dropdown.Item {...dropdownOptions[1]} />
                    <Dropdown.Divider />
                    <Dropdown.Item {...dropdownOptions[2]} />
                    <Dropdown.Item {...dropdownOptions[3]} />
                    <Dropdown.Divider />
                    <Dropdown.Item
                        {...dropdownOptions[4]}
                        className="hover:text-white hover:bg-slack-sidebar-focus"
                        onClick={(e) => handleOnStarChannel(e)}
                    />
                    <Dropdown.Divider />
                    <Dropdown.Item {...dropdownOptions[5]} />
                    <Dropdown.Item {...dropdownOptions[6]} />
                </Dropdown.Menu>
            </Dropdown>
        )
    }

export default ChannelOptionsDropdown
