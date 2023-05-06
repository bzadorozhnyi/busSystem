import { useEffect, useState } from 'react'
import getAll from '../../scripts/get/getAll';
import Buyer from '../../interfaces/Buyer.interface';
import Table from '../../enums/Table.enum';
import { useNavigate } from 'react-router-dom';
import { GridColDef, GridRowParams } from '@mui/x-data-grid';
import PageList from '../../components/PageList';
import Emoji from '../../enums/Emoji.enum';

const dataColumns: GridColDef[] = [
    { field: 'name', headerName: 'Ім\'я', flex: 1 },
    { field: 'contactInformation', headerName: 'Контактна інформація', flex: 1 }
]

function BuyerList() {
    const [dataRows, setDataRows] = useState<Object[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const buyers = await getAll<Buyer>(Table.buyers);
                if (buyers) {
                    const rows = buyers.map(b => {
                        return { ...b };
                    })
                    setDataRows(rows);
                }
            } catch (error) {
                console.error("Error fetching buyers", error);
            }
        }
        fetchData();
    }, [])

    const handleRowClick = (params: GridRowParams) => {
        navigate(`/buyer/${params.id}`)
    }

    return (
        <PageList
            addLink='/add/buyer'
            dataColumns={dataColumns}
            dataRows={dataRows}
            handleRowClick={handleRowClick}
            title={`Покупці ${Emoji.money}`}
        />
    )
}

export default BuyerList