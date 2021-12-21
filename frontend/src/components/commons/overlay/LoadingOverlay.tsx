import React, { FunctionComponent } from 'react'

interface LoadingOverlayProps {}

const LoadingOverlay: FunctionComponent<LoadingOverlayProps> = () => {
    return (
        <div className="h-full w-full flex items-center justify-center">
            <div className="ui active inline center inverted dimmer">
                <div className="ui text loader">Loading</div>
            </div>
        </div>
    )
}

export default LoadingOverlay
