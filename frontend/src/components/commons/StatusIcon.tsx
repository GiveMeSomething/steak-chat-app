import React, { FunctionComponent } from 'react'
import Icon, {
    IconSizeProp
} from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon'
import { UserStatus } from 'types/appEnum'
import { Undefinable } from 'types/commonType'

interface StatusIconProps {
    userStatus: Undefinable<UserStatus>
    size: Undefinable<IconSizeProp>
    className: Undefinable<string>
}

const StatusIcon: FunctionComponent<StatusIconProps> = ({
    userStatus,
    size,
    className
}) => {
    switch (userStatus) {
        case UserStatus.ONLINE:
            return (
                <Icon
                    name="circle"
                    color="green"
                    size={size}
                    className={className}
                />
            )
        case UserStatus.BUSY:
            return (
                <Icon
                    name="circle"
                    color="red"
                    size={size}
                    className={className}
                />
            )
        default:
            return (
                <Icon
                    name="circle"
                    color="grey"
                    size={size}
                    className={className}
                />
            )
    }
}

export default StatusIcon
