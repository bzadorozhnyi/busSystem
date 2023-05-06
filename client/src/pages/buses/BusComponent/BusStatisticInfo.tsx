import { useEffect, useState } from "react";
import getFlightsOfBus from "../../../scripts/get/statistic/bus/getFlightsOfBus";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import DataGridUkUA from "../../../components/DataGridUkUA";
import { useNavigate } from "react-router-dom";
import getAll from "../../../scripts/get/getAll";
import Driver from "../../../interfaces/Driver.interface";
import Table from "../../../enums/Table.enum";
import formatDateString from "../../../scripts/formatDateString";

const dataColumns: GridColDef[] = [
    { field: 'departurePoint', headerName: 'Звідки', flex: 1 },
    { field: 'destinationPoint', headerName: 'Куди', flex: 1 },
    { field: 'shippingTime', headerName: 'Час відправки', flex: 1 },
    { field: 'arrivalTime', headerName: 'Час прибуття', flex: 1 },
    { field: 'driver', headerName: 'Водій', flex: 1 },
    { field: 'cost', headerName: 'Ціна', flex: 1 }
]

interface BusStaticInfoProps {
    busNumber: string;
}

function BusStatisticInfo({ busNumber }: BusStaticInfoProps) {
    const [dataRows, setDataRows] = useState<Object[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const flightsResponse = await getFlightsOfBus(busNumber);
                const driversResponse = await getAll<Driver>(Table.drivers);
                if (flightsResponse && driversResponse) {
                    const rows = flightsResponse.map((flight) => {
                        const { driverId, busNumber, ...flightData } = flight;
                        return {
                            ...flightData,
                            shippingTime: formatDateString(flight.shippingTime),
                            arrivalTime: formatDateString(flight.arrivalTime),
                            driver: driversResponse.find(driver => driver.id === driverId)?.name
                        }
                    });

                    setDataRows(rows);
                }
            } catch (error) {
                console.error(`Error fetching flights of bus ${busNumber}`, error);
            }
        }
        fetchData();
    }, [busNumber])

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

export default BusStatisticInfo;