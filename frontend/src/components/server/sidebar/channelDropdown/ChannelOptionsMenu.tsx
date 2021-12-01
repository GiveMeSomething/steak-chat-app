import React, { FunctionComponent } from 'react'
import { useAppDispatch } from 'redux/hooks'
import { Dropdown, Icon } from 'semantic-ui-react'
import { channelOptions } from 'utils/appConst'
import {
    ChannelInfo,
    unStarSelectedChannel,
    starSelectedChannel,
} from '../../redux/channel.slice'
import {
    setCurrentMetaPanelData,
    setMetaPanelOpen,
} from 'components/server/redux/metaPanel.slice'

interface ChannelOptionsProps {
    starred: boolean
    selectedChannel: ChannelInfo | undefined
    isOpen: boolean
    closeMenu: Function
}

const ChannelOptions: FunctionComponent<ChannelOptionsProps> = ({
    starred,
    isOpen,
    selectedChannel,
    closeMenu,
}) => {
    const dispatch = useAppDispatch()

    const menuOptions = channelOptions(starred)

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
        closeMenu(event)
    }

    const handleOnChannelDetail = (event: React.MouseEvent<HTMLDivElement>) => {
        if (selectedChannel) {
            dispatch(setCurrentMetaPanelData(selectedChannel))
        }

        dispatch(setMetaPanelOpen(true))

        closeMenu(event)
    }

    return (
        <Dropdown
            icon={null}
            id="channel-settings"
            trigger={<Icon name="ellipsis horizontal" />}
            open={isOpen}
        >
            {/* TODO: Currently hard-coding here */}
            <Dropdown.Menu className="top right text-black text-xl font-light">
                <Dropdown.Item {...menuOptions[0]} />
                <Dropdown.Item {...menuOptions[1]} />
                <Dropdown.Divider />
                <Dropdown.Item {...menuOptions[2]} />
                <Dropdown.Item {...menuOptions[3]} />
                <Dropdown.Divider />
                <Dropdown.Item
                    {...menuOptions[4]}
                    onClick={(e) => handleOnStarChannel(e)}
                />
                <Dropdown.Divider />
                <Dropdown.Item
                    {...menuOptions[5]}
                    onClick={(e) => handleOnChannelDetail(e)}
                />
                <Dropdown.Item {...menuOptions[6]} />
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default ChannelOptions
