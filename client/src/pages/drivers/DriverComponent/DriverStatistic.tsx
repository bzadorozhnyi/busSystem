import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import DataGridUkUA from "../../../components/DataGridUkUA";
import { useNavigate } from "react-router-dom";
import getFlightsOfDriver from "../../../scripts/get/statistic/driver/getFlightsOfDriver";
import formatDateString from "../../../scripts/formatDateString";

const dataColumns: GridColDef[] = [
    { field: 'departurePoint', headerName: 'Звідки', flex: 1 },
    { field: 'destinationPoint', headerName: 'Куди', flex: 1 },
    { field: 'shippingTime', headerName: 'Час відправки', flex: 1 },
    { field: 'arrivalTime', headerName: 'Час прибуття', flex: 1 },
    { field: 'busNumber', headerName: 'Автобус', flex: 1 },
    { field: 'cost', headerName: 'Ціна', flex: 1 }
]

interface DriverStaticInfoProps {
    driverId: string
}

function DriverStatistic({ driverId }: DriverStaticInfoProps) {
    const [dataRows, setDataRows] = useState<Object[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const flightsResponse = await getFlightsOfDriver(driverId);
                if (flightsResponse) {
                    const rows = flightsResponse.map((flight) => {
                        const { driverId, ...flightData } = flight;
                        return {
                            ...flightData,
                            shippingTime: formatDateString(flight.shippingTime),
                            arrivalTime: formatDateString(flight.arrivalTime),
                        }
                    });

                    setDataRows(rows);
                }
            }
            catch(error) {
                console.error(`Error fetching flights of driver ${driverId}`, error);
            }
        }

        fetchData();
    }, [driverId])

    function handleRowClick(params: GridRowParams<any>): void {
        navigate(`/flight/${params.id}`);
    }

    return (
        <div>
            {
                dataRows.length > 0 &&
                <>
                <h1>Рейси</h1>
                <DataGridUkUA
                    rows={dataRows}
                    columns={dataColumns}
                    pageSizeOptions={[5, 10, 25, 100]}
                    onRowClick={handleRowClick} />
                </>
            }
        </div>
    )
}

export default DriverStatistic