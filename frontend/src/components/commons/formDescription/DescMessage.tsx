import React, { FunctionComponent } from 'react'

import { Undefinable } from 'types/commonType'

interface DescMessageProps {
    description?: boolean
    error?: boolean
    message: Undefinable<string>
    className?: Undefinable<string>
}

const DescMessage: FunctionComponent<DescMessageProps> = ({
    description,
    error,
    message,
    className
}) => {
    const textColor = (): string => {
        if (description) {
            return 'text-slack-searchbar'
        }
        if (error) {
            return 'text-red-500'
        }

        return ''
    }
    return (
        <p className={`${textColor()} font-semibold ${className || 'py-2'}`}>
            {message}
        </p>
    )
}

export default DescMessage
