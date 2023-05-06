import { Button } from '@mui/material'
import { GridColDef, GridRowParams } from '@mui/x-data-grid'
import { useNavigate } from 'react-router-dom';
import '../styles/list.css';
import DataGridUkUA from './DataGridUkUA';

type Props = {
    addLink: string,
    dataColumns: GridColDef[],
    dataRows: Object[],
    handleRowClick(params: GridRowParams): void,
    title?: string
}

function PageList({ addLink, dataColumns, dataRows, handleRowClick, title }: Props) {
    const navigate = useNavigate();

    const handleReturnClick = () => {
        navigate('/');
    }

    const handleAddButtonClick = () => {
        navigate(addLink);
    }

    return (
        <div className='page-list'>
            <div className='page-list-header'>
                <Button
                    className='return-button'
                    onClick={handleReturnClick}
                    variant='outlined'>
                    До головної
                </Button>
                {title && <h1>{title}</h1>}
                <Button
                    className='add-button'
                    onClick={handleAddButtonClick}
                    color='success'
                    variant='outlined'>
                    Додати новий
                </Button>
            </div>
            <DataGridUkUA
                columns={dataColumns}
                onRowClick={handleRowClick}
                pageSizeOptions={[5, 10, 25, 100]}
                rows={dataRows}
            />
        </div>
    )
}

export default PageList