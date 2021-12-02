import React, { FunctionComponent } from 'react'

import { Progress } from 'semantic-ui-react'

interface ProgressBarProps {
    progress: number
}

const ProgressBar: FunctionComponent<ProgressBarProps> = ({ progress }) => {
    return (
        <Progress
            percent={progress}
            progress
            indicating
            size="medium"
            inverted
            className="mx-auto"
        />
    )
}

export default ProgressBar
