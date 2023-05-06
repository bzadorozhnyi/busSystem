import { GridColDef, GridRowParams } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import CarrierCompany from '../../interfaces/CarrierCompany.interface';
import { useNavigate } from 'react-router-dom';
import Table from '../../enums/Table.enum';
import getAll from '../../scripts/get/getAll';
import PageList from '../../components/PageList';
import Emoji from '../../enums/Emoji.enum';

const dataColumns: GridColDef[] = [
    { field: 'name', headerName: 'Назва', flex: 1 }
]

function CarrierCompanyList() {
    const [dataRows, setDataRows] = useState<Object[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const companies = await getAll<CarrierCompany>(Table.carrierCompanies);
                if (companies) {
                    const rows = companies.map(c => {
                        return { ...c };
                    })
                    setDataRows(rows);
                }
            }
            catch(error) {
                console.error("Error fetching companies", error);
            }
        }
        fetchData();
    }, [])

    const handleRowClick = (params: GridRowParams) => {
        navigate(`/carrier_company/${params.id}`)
    }

    return (
        <PageList
            addLink='/add/carrier_company'
            dataColumns={dataColumns}
            dataRows={dataRows}
            handleRowClick={handleRowClick}
            title={`Компанії перевізники ${Emoji.company}`}
        />
    )
}

export default CarrierCompanyList