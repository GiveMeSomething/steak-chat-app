import React, { FunctionComponent } from 'react'

interface LoadingScreenProps {}

const LoadingScreen: FunctionComponent<LoadingScreenProps> = () => {
    return (
        <div className="h-screen w-screen max-h-screen flex items-center justify-center">
            <div className="ui active inverted dimmer">
                <div className="ui text loader">Loading</div>
            </div>
        </div>
    )
}

export default LoadingScreen
