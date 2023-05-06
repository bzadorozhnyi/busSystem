import { GridColDef, GridRowParams } from '@mui/x-data-grid'
import { useEffect, useState } from 'react'
import Driver from '../../interfaces/Driver.interface';
import Flight from '../../interfaces/Flight.interface';
import Table from '../../enums/Table.enum';
import getAll from '../../scripts/get/getAll';
import { useNavigate } from 'react-router-dom';
import formatDateString from '../../scripts/formatDateString';
import "../../styles/list.css";
import PageList from '../../components/PageList';
import Emoji from '../../enums/Emoji.enum';

const dataColumns: GridColDef[] = [
    {field: 'departurePoint', headerName: 'Звідки', flex: 1},
    {field: 'destinationPoint', headerName: 'Куди', flex: 1},
    {field: 'shippingTime', headerName: 'Час відправки', flex: 1},
    {field: 'arrivalTime', headerName: 'Час прибуття', flex: 1},
    {field: 'busNumber', headerName: 'Автобус', flex: 1},
    {field: 'driver', headerName: 'Водій', flex: 1},
    {field: 'cost', headerName: 'Ціна', flex: 1}
]

function FlightList() {
    const [dataRows, setDataRows] = useState<Object[]>([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                const drivers = await getAll<Driver>(Table.drivers);
                const flights = await getAll<Flight>(Table.flights);

                if (drivers && flights) {
                    const rows = flights.map((flight) => {
                        return {
                            id: flight.id,
                            departurePoint: flight.departurePoint,
                            destinationPoint: flight.destinationPoint,
                            shippingTime: formatDateString(flight.shippingTime),
                            arrivalTime: formatDateString(flight.arrivalTime),
                            busNumber: flight.busNumber,
                            driver: drivers?.find(driver => driver.id === flight.driverId)?.name,
                            cost: flight.cost
                        }
                    })
        
                    setDataRows(rows);
                }
            }
            catch (error) {
                console.error("Error fetching data", error);
            }
        }

        fetchData();
    }, [])

    function handleRowClick(params: GridRowParams) {
        navigate(`/flight/${params.id}`);
    }

    return (
        <PageList
            addLink='/add/flight'
            dataColumns={dataColumns}
            dataRows={dataRows}
            handleRowClick={handleRowClick}
            title={`Рейси ${Emoji.road}`}
        />
    )
}

export default FlightList