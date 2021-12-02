import React, { FunctionComponent } from 'react'

import { Undefinable } from 'types/commonType'

interface ErrorMessageProps {
    message: Undefinable<string>
}

const ErrorMessage: FunctionComponent<ErrorMessageProps> = ({ message }) => {
    return <p className="text-red-600 font-semibold py-2">{message}</p>
}

export default ErrorMessage
