import { FC, useEffect, useState } from 'react'
import Bus from '../../interfaces/Bus.interface';
import Table from '../../enums/Table.enum';
import getAll from '../../scripts/get/getAll';
import { GridColDef, GridRowParams } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import CarrierCompany from '../../interfaces/CarrierCompany.interface';
import PageList from '../../components/PageList';
import Emoji from '../../enums/Emoji.enum';

const dataColumns: GridColDef[] = [
    { field: 'id', headerName: 'Номер автобуса', flex: 1 },
    { field: 'brand', headerName: 'Марка', flex: 1 },
    { field: 'carrier_company', headerName: 'Компанія перевізник', flex: 1 },
    { field: 'numberOfSeats', headerName: 'Кількість місць', type: 'number', flex: 1 }
];

const BusList: FC = () => {
    const [dataRows, setDataRows] = useState<Object[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const buses = await getAll<Bus>(Table.buses);
                const carrierCompanies = await getAll<CarrierCompany>(Table.carrierCompanies);

                if (buses && carrierCompanies) {
                    const rows = buses.map((bus) => {
                        const obj = {
                            id: bus.id,
                            brand: bus.brand,
                            carrier_company: carrierCompanies?.find(company => company.id === bus.carrierCompanyId)?.name,
                            numberOfSeats: bus.numberOfSeats
                        }

                        return obj;
                    });
                    setDataRows(rows);
                }
            } catch (error) {
                console.error("Error fetching data", error);
            }

        }
        fetchData();
    }, [])

    const handleRowClick = (params: GridRowParams) => {
        navigate(`/bus/${params.id}`);
    }

    return (
        <PageList
            addLink='/add/bus'
            dataColumns={dataColumns}
            dataRows={dataRows}
            handleRowClick={handleRowClick}
            title={`Автобуси ${Emoji.bus}`}
        />
    )
}

export default BusList;