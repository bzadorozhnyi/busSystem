import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import getBusesofCompany from "../../../scripts/get/statistic/carrierCompany/getBusesOfCompany";
import getDriversOfCompany from "../../../scripts/get/statistic/carrierCompany/getDriversOfCompany";
import DataGridUkUA from "../../../components/DataGridUkUA";

interface CarrierCompanyStaticInfoProps {
    id: string;
}

const dataColumnsBuses: GridColDef[] = [
    { field: 'id', headerName: 'Номер автобуса', flex: 1 },
    { field: 'brand', headerName: 'Марка', flex: 1 },
    { field: 'numberOfSeats', headerName: 'Кількість місць', flex: 1 }
]

const dataColumnsDrivers: GridColDef[] = [
    { field: 'name', headerName: 'Ім\'я', flex: 1 },
    { field: 'contactInfo', headerName: 'Контактна інформація', flex: 1 }
]

function CarrierCompanyStatisticInfo({ id }: CarrierCompanyStaticInfoProps) {
    const [dataRowsBuses, setDataRowsBuses] = useState<Object[]>([]);
    const [dataRowsDrivers, setDataRowsDrivers] = useState<Object[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const busesResponse = await getBusesofCompany(id);
                console.log(busesResponse);
                if (busesResponse) {
                    const dataBuses = busesResponse?.map((bus) => {
                        return {
                            id: bus.id,
                            brand: bus.brand,
                            numberOfSeats: bus.numberOfSeats
                        }
                    })
                    setDataRowsBuses(dataBuses);
                }

                const driversResponse = await getDriversOfCompany(id);
                if (driversResponse) {
                    const dataDrivers = driversResponse.map((driver) => {
                        return {
                            id: driver.id,
                            name: driver.name,
                            contactInfo: driver.contactInformation
                        }
                    })
                    setDataRowsDrivers(dataDrivers);
                }
            }
            catch (error) {
                console.error("Error fetching data", error);
            }
        }

        fetchData();
    }, [id])

    function handleBusRowClick(params: GridRowParams<any>): void {
        navigate(`/bus/${params.id}`);
    }

    function handleDriverRowClick(params: GridRowParams<any>): void {
        navigate(`/driver/${params.id}`);
    }

    return (
        <div>
            <h1>Статистика</h1>
            {
                dataRowsBuses?.length !== 0 && 
                <div>
                    <h3>Автобуси</h3>
                    <DataGridUkUA
                        rows={dataRowsBuses}
                        columns={dataColumnsBuses}
                        pageSizeOptions={[5, 10, 25, 100]}
                        onRowClick={handleBusRowClick} />
                </div> 
            }
            {
                dataRowsDrivers?.length !== 0 &&
                <div>
                    <h3>Водії</h3>
                    <DataGridUkUA
                        rows={dataRowsDrivers}
                        columns={dataColumnsDrivers}
                        pageSizeOptions={[5, 10, 25, 100]}
                        onRowClick={handleDriverRowClick} />
                </div>
            }
        </div>
    );
}

export default CarrierCompanyStatisticInfo;