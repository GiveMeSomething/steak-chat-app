import React, { FunctionComponent } from 'react'
import ChannelDetailPanel from './ChannelDetailPanel'

interface MetaPanelProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const MetaPanel: FunctionComponent<MetaPanelProps> = () => {
    return (
        <div className="flex w-full h-full flex-col border-l-2">
            <div className="flex items-center px-4 py-3 border-b-2">
                <h3 className="font-semibold">Channel Details</h3>
            </div>
            <ChannelDetailPanel />
        </div>
    )
}

export default MetaPanel
