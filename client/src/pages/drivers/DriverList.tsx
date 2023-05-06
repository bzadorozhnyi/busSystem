import { GridColDef, GridRowParams } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import Driver from '../../interfaces/Driver.interface';
import Table from '../../enums/Table.enum';
import getAll from '../../scripts/get/getAll';
import { useNavigate } from 'react-router-dom';
import CarrierCompany from '../../interfaces/CarrierCompany.interface';
import PageList from '../../components/PageList';
import Emoji from '../../enums/Emoji.enum';

const dataColumns: GridColDef[] = [
    {field: 'name', headerName: 'Ім\'я', flex: 1},
    {field: 'carrier_company', headerName: 'Компанія перевізник', flex: 1},
    {field: 'contactInformation', headerName: 'Контактна інформація', flex: 1}
]

function DriverList() {
    const [dataRows, setDataRows] = useState<Object[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const drivers = await getAll<Driver>(Table.drivers);
                const carrierCompanies = await getAll<CarrierCompany>(Table.carrierCompanies);

                if (drivers && carrierCompanies) {
                    const rows = drivers.map((driver) => {
                        return {
                            id: driver.id,
                            name: driver.name,
                            carrier_company: carrierCompanies?.find(company => company.id === driver.carrierCompanyId)?.name,
                            contactInformation: driver.contactInformation
                        }
                    })
        
                    setDataRows(rows);
                }

            } catch (error) {
                console.error("Error fetching data", error);
            }
        }
        fetchData();
    }, [])

    const handleRowClick = (params: GridRowParams) => {
        navigate(`/driver/${params.id}`);
    }

    return (
        <PageList
            addLink='/add/driver'
            dataColumns={dataColumns}
            dataRows={dataRows}
            handleRowClick={handleRowClick}
            title={`Водії ${Emoji.human}`}
        />
    )
}

export default DriverList