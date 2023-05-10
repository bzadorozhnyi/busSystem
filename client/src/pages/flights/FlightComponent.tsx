import { ChangeEvent, useEffect, useState } from 'react'
import getById from '../../scripts/get/getById';
import Table from '../../enums/Table.enum';
import { useNavigate, useParams } from 'react-router-dom';
import Flight from '../../interfaces/Flight.interface';
import { Alert, Button, Snackbar, TextField } from '@mui/material';
import DateTimePicker from '../../components/DateTimePicker/DateTimePicker';
import SelectDateType from '../../components/DateTimePicker/SelectDateType';
import updateById from '../../scripts/update/updateById';
import getFlightTickets from '../../scripts/get/getFlightTickets';
import { GridColDef, GridRowParams, GridRowSelectionModel } from '@mui/x-data-grid';
import "../../styles/infoBlock.css";
import Emoji from '../../enums/Emoji.enum';
import { SnackbarMessage } from '../../interfaces/SnackbarMessage.interface';
import isFlightValid from '../../fieldsValidations/isValidFlight';
import ReturnWrapper from '../../components/ReturnWrapper';
import PageStatus from '../../enums/PageStatus.enum';
import LoadingPage from '../LoadingPage/LoadingPage';
import PageNotFound from '../PageNotFound/PageNotFound';
import DataGridUkUA from '../../components/DataGridUkUA';
import deleteTicket from '../../scripts/delete/deleteTicket';
import { AxiosResponse } from 'axios';

const dataColumnsFlightTicketsList: GridColDef[] = [
    { field: 'seat', headerName: 'Місце', flex: 1 },
    { field: 'name', headerName: 'Ім\'я', flex: 1 },
    { field: 'contactInformation', headerName: 'Контактна інформація', flex: 1 },
]

function FlightTicketsList({ flightId }: { flightId: string }) {
    const [dataRows, setDataRows] = useState<Object[]>([]);
    const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData =async () => {
            try {
                const buyedTickets = await getFlightTickets(flightId ?? '');
                if (buyedTickets) {
                    const rows = buyedTickets.map(ticket => {
                        return {
                            ...ticket,
                            id: `${ticket.seat}:${ticket.id}`
                        }
                    })
                    setDataRows(rows);
                }
            } catch (error) {
                console.error(`Error fetching tickets for flight ${flightId}`, error);
                
            }
        }
        fetchData();
    }, [flightId])

    function handleRowClick(params: GridRowParams) {
        const rowId: string = (params.id as string);
        const buyerId: string = rowId.slice(rowId.indexOf(':') + 1);
        
        navigate(`/buyer/${buyerId}`);
    }

    function handleAddTicketsButton() {
        navigate(`/add/tickets/${flightId}`);
    }

    async function handleDeleteButtonClick() {
        const deletePromises: Promise<AxiosResponse<any, any>>[] = [];

        selectedTickets.forEach(async ticketId => {
            const seat = Number(ticketId.slice(0, ticketId.indexOf(':')));
            deletePromises.push(deleteTicket(flightId, seat));
        })

        await Promise.all(deletePromises).then(() => {
            setDataRows(dataRows.filter((row: any) => !selectedTickets.includes(row.id!)));
            setSelectedTickets([]);
        })
    }

    function handleCheckboxChange(rowSelectionModel: GridRowSelectionModel): void {
        setSelectedTickets(rowSelectionModel as string[]);
    }

    return (
        <div className={'tickets-list'}>
            <Button
                onClick={handleAddTicketsButton}
                variant='outlined'>Додати білети</Button>
            <div>
                {
                    dataRows?.length === 0 && <h3>На рейс не куплено білетів...</h3>
                }
            </div>
            <>
                {
                    dataRows?.length !== 0 &&
                    <div>
                        <h3>Куплені білети:</h3>
                        <Button
                            sx={{marginBottom: '1rem'}}
                            color='error'
                            onClick={handleDeleteButtonClick}
                            variant='outlined'>
                            Видалити
                        </Button>
                        <DataGridUkUA
                            checkboxSelection
                            rows={dataRows}
                            columns={dataColumnsFlightTicketsList}
                            pageSizeOptions={[5, 10, 25, 100]}
                            onRowClick={handleRowClick}
                            onRowSelectionModelChange={handleCheckboxChange}
                        />
                    </div>
                }
            </>
        </div>
    )
}

function FlightComponent() {
    const [flight, setFlight] = useState<Flight | null>(null);
    const [pageStatus, setPageStatus] = useState<PageStatus>(PageStatus.loading);
    const [snackbarMessage, setSnackbarMessage] = useState<SnackbarMessage>({
        active: false,
        message: '',
        severity: 'success'
    });
    let flightId = useParams().id;

    useEffect(() => {
        const fetchData =async () => {
            try {
                const isExist = await getById<Flight>(Table.flights, flightId ?? '');
                if (!isExist) {
                    setPageStatus(PageStatus.notExist);
                }
                else {
                    setPageStatus(PageStatus.exist);
                }
                
                const flightResponse = await getById<Flight>(Table.flights, flightId ?? '')
                setFlight(flightResponse);
            } catch (error) {
                console.error(`Error fetching flight ${flightId}`, error);
            }
        }

        fetchData();
    }, [])

    function handlePropertyChange(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        setFlight({
            ...flight,
            [event.target.name]: event.target.value
        } as Flight)
    }

    const handleDateTimeChange = (newDate: SelectDateType, name: string) => {
        setFlight({
            ...flight,
            [name]: SelectDateType.fromSelectDateType(newDate).toDataBaseISOString()
        } as Flight)
    }

    const handleUpdateButtonClick = async () => {
        if (flight) {
            let validationMessage = await isFlightValid(flight);
            if (!validationMessage.valid) {
                setSnackbarMessage({
                    active: true,
                    message: validationMessage.message!,
                    severity: 'error'
                });
                return;
            }

            let { id, ...newValue } = flight;
            newValue.shippingTime = SelectDateType.fromISOString(newValue.shippingTime).toDataBaseISOString();
            newValue.arrivalTime = SelectDateType.fromISOString(newValue.arrivalTime).toDataBaseISOString();

            try {
                updateById(Table.flights, flight?.id ?? '', newValue)
                setSnackbarMessage({
                    active: true,
                    message: 'Дані оновлено!',
                    severity: 'success'
                });
            } catch (error) {
                setSnackbarMessage({
                    active: true,
                    message: 'Виникла помилка, дані не оновлено!',
                    severity: 'error'
                });
                console.error('update error', error);
            }
        }
    }

    function handleCostChange(event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        if (event.target.value === '' || Number(event.target.value) < 0) {
            setFlight({
                ...flight,
                cost: 0
            } as Flight)
            return;
        }
        setFlight({
            ...flight,
            cost: Number(event.target.value)
        } as Flight)
    }

    const handleSnackBarClose = () => {
        setSnackbarMessage({
            active: false,
            message: '',
            severity: 'success'
        });
    }

    if (pageStatus === PageStatus.loading) {
        return <LoadingPage />
    }
    else if(pageStatus === PageStatus.notExist) {
        return <PageNotFound />
    }

    return (
        <ReturnWrapper returnLink='/flights'>
            <div>
                <div className="info-block">
                    <h1>{`Рейс ${Emoji.road}`}</h1>
                    <div className="row">
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            label={`Місце відправки ${Emoji.city}`}
                            name='departurePoint'
                            onChange={handlePropertyChange}
                            value={flight?.departurePoint}
                        />
                        ➡
                        <TextField
                            InputLabelProps={{ shrink: true }}
                            label={`Місце прибуття ${Emoji.city}`}
                            name='destinationPoint'
                            onChange={handlePropertyChange}
                            value={flight?.destinationPoint}
                        />
                    </div>
                    <DateTimePicker
                        blockName={`Час відправки ${Emoji.time}`}
                        onChange={handleDateTimeChange}
                        name='shippingTime'
                        value={SelectDateType.fromISOString(flight?.shippingTime ?? new Date().toISOString())} />
                    <DateTimePicker
                        blockName={`Час прибуття ${Emoji.time}`}
                        onChange={handleDateTimeChange}
                        name='arrivalTime'
                        value={SelectDateType.fromISOString(flight?.arrivalTime ?? new Date().toISOString())} />
                    <TextField
                        InputLabelProps={{ shrink: true }}
                        label='Вартість 💵'
                        name='cost'
                        onChange={handleCostChange}
                        type='number'
                        value={flight?.cost}
                    />
                    <Button
                        variant='outlined'
                        onClick={handleUpdateButtonClick}>
                        Оновити
                    </Button>
                </div>

                <FlightTicketsList flightId={flightId ?? ''} />
                <Snackbar open={snackbarMessage.active} autoHideDuration={3000} onClose={handleSnackBarClose}>
                    <Alert severity={snackbarMessage.severity} sx={{ width: '100%' }} onClose={handleSnackBarClose}>
                        {
                            <span>{snackbarMessage.message}</span>
                        }
                    </Alert>
                </Snackbar>
            </div>
        </ReturnWrapper>
    )
}

export default FlightComponent

