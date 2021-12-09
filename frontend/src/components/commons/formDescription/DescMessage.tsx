import React, { FunctionComponent } from 'react'

import { Undefinable } from 'types/commonType'

interface DescMessageProps {
    type: 'desc' | 'error'
    message: Undefinable<string>
    className?: Undefinable<string>
}

const DescMessage: FunctionComponent<DescMessageProps> = ({
    type,
    message,
    className,
}) => {
    const textColor = () => {
        switch (type) {
            case 'desc':
                return 'text-slack-searchbar'
            case 'error':
                return 'text-red-600'
            default:
                break
        }
    }
    return (
        <p className={`${textColor()} font-semibold  ${className || 'py-2'}`}>
            {message}
        </p>
    )
}

export default DescMessage
