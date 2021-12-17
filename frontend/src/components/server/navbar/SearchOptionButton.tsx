import React, { FunctionComponent } from 'react'

import { Button, Icon, SemanticICONS } from 'semantic-ui-react'

interface SearchOptionButtonProps {
    buttonLabel: string
    iconName: SemanticICONS
}

const SearchOptionButton: FunctionComponent<SearchOptionButtonProps> = ({
    buttonLabel,
    iconName
}) => {
    return (
        <Button icon className="font-light">
            <Icon className="mx-2" name={iconName} />
            <span className="px-2">{buttonLabel}</span>
        </Button>
    )
}

export default SearchOptionButton
