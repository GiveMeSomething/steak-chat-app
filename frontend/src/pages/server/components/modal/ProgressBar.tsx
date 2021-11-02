import React, { FunctionComponent } from 'react'
import { Progress } from 'semantic-ui-react'

interface ProgressBarProps {
    uploadState: string
    progress: number
}

const ProgressBar: FunctionComponent<ProgressBarProps> = ({
    uploadState,
    progress,
}) => {
    if (uploadState) {
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
    } else {
        return null
    }
}

export default ProgressBar
