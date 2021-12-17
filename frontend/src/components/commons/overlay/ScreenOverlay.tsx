import React, { FunctionComponent } from 'react'
import ReactDOM from 'react-dom'
interface ScreenOverlayProps {
    handleOnClick: React.MouseEventHandler<HTMLDivElement>
}

const overlayRoot = document.getElementById('overlay-root')

const ScreenOverlay: FunctionComponent<ScreenOverlayProps> = ({
    handleOnClick
}) => {
    if (overlayRoot) {
        return ReactDOM.createPortal(
            <div
                className="absolute h-screen w-screen top-0 left-0 z-10"
                onClick={handleOnClick}
            ></div>,
            overlayRoot
        )
    } else {
        return (
            <div
                className="absolute h-screen w-screen top-0 left-0 z-10"
                onClick={handleOnClick}
            ></div>
        )
    }
}

export default ScreenOverlay
