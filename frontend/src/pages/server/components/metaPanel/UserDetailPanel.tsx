import { UserInfo } from 'pages/auth/components/auth.slice'
import React, { FunctionComponent } from 'react'
import { Button, Icon } from 'semantic-ui-react'
import { UserStatus } from 'utils/appEnum'

interface UserDetailPanelProps {
    data: UserInfo
}

const UserDetailPanel: FunctionComponent<UserDetailPanelProps> = ({ data }) => {
    if (data.uid) {
        return (
            <div className="w-full h-full">
                <div className="flex flex-col items-center justify-center p-2">
                    <div className="mx-auto">
                        <img src={data.photoUrl} className="w-40 h-auto" />
                    </div>
                    <div className="flex items-baseline justify-center">
                        <h2 className="font-semibold p-2">{data.username}</h2>
                        <Icon
                            name="circle"
                            color={
                                data.status === UserStatus.ONLINE
                                    ? 'green'
                                    : 'grey'
                            }
                            size="small"
                        />
                    </div>
                </div>
                <div className="flex justify-evenly text-base font-light">
                    <div className="flex flex-col items-center justify-center">
                        <Button circular icon="comments" />
                        <p>Messages</p>
                    </div>
                </div>
                <div className="flex flex-col px-4 font-light gap-4 pt-4">
                    <div>
                        <h3 className="font-semibold">Display name</h3>
                        <h3>{data.username}</h3>
                    </div>
                    <div>
                        <h3 className="font-semibold">Email</h3>
                        <h3>{data.email}</h3>
                    </div>
                </div>
            </div>
        )
    } else {
        return null
    }
}

export default UserDetailPanel
