import React, { FunctionComponent } from 'react'

interface TypingLoaderProps {}

const TypingLoader: FunctionComponent<TypingLoaderProps> = () => {
    return (
        <div className="flex items-center mx-2">
            <div className="typing-loader__dot"></div>
            <div className="typing-loader__dot"></div>
            <div className="typing-loader__dot"></div>
        </div>
    )
}

export default TypingLoader
