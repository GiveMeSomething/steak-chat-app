import { UserInfo } from 'pages/auth/components/auth.slice'
import React, { FunctionComponent } from 'react'

interface UserDetailPanelProps {
    data: UserInfo
}

const UserDetailPanel: FunctionComponent<UserDetailPanelProps> = () => {
    return <div>User Detail</div>
}

export default UserDetailPanel
