import React, { FunctionComponent } from 'react'

const ServerLayout: FunctionComponent = () => {
    return (
        <div className="fullscreen text-white overflow-hidden">
            <div className="w-full bg-slack-navbar py-2 max-h-10">
                <div className="flex items-center justify-center">
                    <input
                        type="text"
                        className="bg-slack-searchbar w-2/5 text-slack-text-light col-start-2 absolute placeholder-white px-4"
                        placeholder="Search something in ..."
                    />
                    <div className="bg-white ml-auto mx-2 ">Avatar</div>
                </div>
            </div>
            <div className="grid grid-cols-12 fullsize">
                <div className="col-span-2 fullsize bg-slack-sidebar-normal">
                    Server Channels and stuffs
                </div>
                <div className="col-span-10 w-full h-full bg-white text-gray-800">
                    Messages
                </div>
            </div>
        </div>
    )
}

export default ServerLayout
