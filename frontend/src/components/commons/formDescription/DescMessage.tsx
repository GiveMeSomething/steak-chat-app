import React, { FunctionComponent } from 'react'

import { Undefinable } from 'types/commonType'

interface DescMessageProps {
    type: 'desc' | 'error'
    message: Undefinable<string>
}

const DescMessage: FunctionComponent<DescMessageProps> = ({
    type,
    message,
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
        <p className={`${textColor()} font-semibold py-2 text-slack-searchbar`}>
            {message}
        </p>
    )
}

export default DescMessage
