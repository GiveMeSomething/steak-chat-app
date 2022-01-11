import React, { FunctionComponent } from 'react'
import { Popup } from 'semantic-ui-react'

interface AvatarPopupProps {
    photoUrl: string
    popupContent: string
}

const AvatarPopup: FunctionComponent<AvatarPopupProps> = ({
    photoUrl,
    popupContent
}) => {
    return (
        <Popup
            trigger={<img src={photoUrl} className="max-h-6 w-6 rounded-md" />}
            position="bottom right"
        >
            <Popup.Content>{popupContent}</Popup.Content>
        </Popup>
    )
}

export default AvatarPopup
