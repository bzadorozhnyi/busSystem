import { Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

type Props = {
    children: React.ReactNode,
    returnLink: string
}

function ReturnWrapper({ children, returnLink }: Props) {
    const navigate = useNavigate();

    const handleReturnToListButtonClick = () => {
        navigate(returnLink);
    }

    return (
        <div>
            <Button
                onClick={handleReturnToListButtonClick}
                variant='outlined'>
                Повернутися до списку
            </Button>
            {children}
        </div>
    )
}

export default ReturnWrapper