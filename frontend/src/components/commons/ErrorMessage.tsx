import React, { FunctionComponent } from 'react'
import { Undefinable } from 'types/commonType'

interface ErrorMessageProps {
    content: Undefinable<string>
}

const ErrorMessage: FunctionComponent<ErrorMessageProps> = ({ content }) => {
    return <p className="text-red-600 font-semibold py-2">{content}</p>
}

export default ErrorMessage
