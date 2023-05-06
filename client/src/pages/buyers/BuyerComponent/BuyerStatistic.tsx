import { useEffect, useState } from "react";
import getTicketsOfBuyer from "../../../scripts/get/statistic/buyers/getTicketsOfBuyer";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import DataGridUkUA from "../../../components/DataGridUkUA";
import formatDateString from "../../../scripts/formatDateString";
import { useNavigate } from "react-router-dom";

const dataColumns: GridColDef[] = [
    { field: 'departurePoint', headerName: 'Звідки', flex: 1 },
    { field: 'destinationPoint', headerName: 'Куди', flex: 1 },
    { field: 'shippingTime', headerName: 'Час відправки', flex: 1 },
    { field: 'arrivalTime', headerName: 'Час прибуття', flex: 1 },
    { field: 'busNumber', headerName: 'Автобус', flex: 1 },
    { field: 'driver', headerName: 'Водій', flex: 1 },
    { field: 'cost', headerName: 'Ціна', flex: 1 }
]

interface BuyerStatisticProps {
    id: string;
}
function BuyerStatistic({ id }: BuyerStatisticProps) {
    const [dataRows, setDataRows] = useState<Object[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const ticketsResponse = await getTicketsOfBuyer(id);
                if (ticketsResponse) {
                    const rows = ticketsResponse.map((ticket: { shippingTime: any; arrivalTime: any; }) => {
                        return {
                            ...ticket,
                            shippingTime: formatDateString(ticket.shippingTime),
                            arrivalTime: formatDateString(ticket.arrivalTime),
                        }
                    })

                    setDataRows(rows);
                }
            } catch (error) {
                console.error(`Error fetching tickets of buyer: ${id}`, error);
            }
        }

        fetchData();
    }, [id])


    function handleRowClick(params: GridRowParams<any>): void {
        navigate(`/flight/${params.id}`);
    }

    return (
        <div>
            {
                dataRows.length > 0 &&
                <>
                    <h1>Квитки</h1>
                    <DataGridUkUA
                        rows={dataRows}
                        columns={dataColumns}
                        onRowClick={handleRowClick}
                    />
                </>
            }
        </div>
    )
}

export default BuyerStatistic