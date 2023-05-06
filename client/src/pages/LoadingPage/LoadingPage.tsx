import { CircularProgress } from '@mui/material'
import '../../styles/loadingPage.css'

function LoadingPage() {
    return (
        <div className='loading-page'>
            <CircularProgress />
        </div>
    )
}

export default LoadingPage