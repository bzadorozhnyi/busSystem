import { SyntheticEvent, useEffect, useState } from 'react'
import getAll from '../../scripts/get/getAll';
import Buyer from '../../interfaces/Buyer.interface';
import Table from '../../enums/Table.enum';
import { Alert, Autocomplete, Button, Snackbar, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import getById from '../../scripts/get/getById';
import Flight from '../../interfaces/Flight.interface';
import Bus from '../../interfaces/Bus.interface';
import getOccupiedSeats from '../../scripts/get/statistic/flight/getOccupiedSeats';
import isValidTicket from '../../fieldsValidations/isValidTicket';
import create from '../../scripts/post/create';
import { SnackbarMessage } from '../../interfaces/SnackbarMessage.interface';
import '../../styles/addNew.css';

interface AutocompleteOptions {
    id: string;
    label: string;
    disabled?: boolean;
}

interface Tickets {
    buyerId: string;
    flightId: string;
    seats: number[];
}

interface Ticket {
    buyerId: string;
    flightId: string;
    seat: number;
}

function AddTickets() {
    const flightId = useParams().id;

    const [tickets, setTickets] = useState<Tickets>({
        buyerId: '',
        flightId: flightId ?? '',
        seats: []
    });
    const [buyersLabels, setBuyersLabels] = useState<AutocompleteOptions[]>([]);
    const [seats, setSeats] = useState<AutocompleteOptions[]>([]);
    const [snackbarMessage, setSnackbarMessage] = useState<SnackbarMessage>({
        active: false,
        message: '',
        severity: 'success'
    })


    useEffect(() => {
        const fetchData = async () => {
            try {
                const buyersResponse = await getAll<Buyer>(Table.buyers);
                if (buyersResponse) {
                    const options = buyersResponse.map(buyer => {
                        return {
                            id: buyer.id,
                            label: buyer.name
                        }
                    })
                    setBuyersLabels(options);
                }

                const busNumber = (await getById<Flight>(Table.flights, flightId ?? ''))?.busNumber;
                const numberOfSeats = (await getById<Bus>(Table.buses, busNumber ?? ''))?.numberOfSeats;
                const occupiedSeats = (await getOccupiedSeats(flightId ?? '')).map((seat: { seat: any; }) => seat.seat);

                if (busNumber && numberOfSeats) {
                    const aviableSeats: AutocompleteOptions[] = Array.from({ length: numberOfSeats ?? 0 }).map((_, index) => {
                        return {
                            id: (index + 1).toString(),
                            label: (index + 1).toString(),
                            disabled: occupiedSeats.includes(index + 1)
                        }
                    })

                    setSeats(aviableSeats);
                }
            }
            catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [])

    const handleBuyerChange = (event: SyntheticEvent<Element, Event>, value: AutocompleteOptions | null): void => {
        setTickets({
            ...tickets,
            buyerId: value?.id ?? ''
        })
    }

    const handleSeatsChange = (event: SyntheticEvent<Element, Event>, value: AutocompleteOptions[]): void => {
        setTickets({
            ...tickets,
            seats: value.map(seat => Number(seat.id))
        })
    }

    const handleAddButtonClick = () => {
        const notAddedTickets: number[] = [];
        tickets.seats.forEach(async seat => {
            const ticket: Ticket = {
                buyerId: tickets.buyerId,
                flightId: tickets.flightId,
                seat: seat
            };
            const validationMessage = await isValidTicket(ticket);
            console.log(validationMessage);
            if (!validationMessage.valid) {
                notAddedTickets.push(seat);
            }
            else {
                try {
                    const createResponse = await create<Ticket>(Table.tickets, ticket);
                    console.log(createResponse);
                    if (!createResponse) {
                        notAddedTickets.push(seat);
                    }
                }
                catch (error) {
                    console.error(`Error while creating ticket: ${seat}`, error);
                    notAddedTickets.push(seat);
                }
            }
        });

        if (notAddedTickets.length > 0) {
            setSnackbarMessage({
                active: true,
                message: `Помилка при додаванні білетів: ${notAddedTickets.join(', ')}`,
                severity: 'error'
            })
        }
        else if (tickets.buyerId === '') {
            setSnackbarMessage({
                active: true,
                message: 'Покупець не вказаний',
                severity: 'error'
            })
        }
        else if (tickets.seats.length === 0) {
            setSnackbarMessage({
                active: true,
                message: 'Місця не вказані',
                severity: 'error'
            })
        }
        else {
            setSnackbarMessage({
                active: true,
                message: 'Білети додані',
                severity: 'success'
            })
        }
    }

    const handleSnackBarClose = () => {
        setSnackbarMessage({
            active: false,
            message: '',
            severity: 'success'
        });
    }

    return (
        <div className="add-block">
            <h1>Квитки</h1>
            <Autocomplete
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={buyersLabels ?? []}
                sx={{ width: '300px' }}
                onChange={handleBuyerChange}
                renderInput={(params) => <TextField
                    {...params}
                    InputLabelProps={{ shrink: true }}
                    label="Покупець" />}
            />

            <Autocomplete
                disableCloseOnSelect
                multiple
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionDisabled={(option) => option.disabled!}
                options={seats ?? []}
                sx={{ width: '300px' }}
                onChange={handleSeatsChange}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        InputLabelProps={{ shrink: true }}
                        label="Місця"
                    />
                )}
            />

            <Button
                onClick={handleAddButtonClick}
                variant='outlined'>
                Створити
            </Button>

            <Snackbar open={snackbarMessage.active} autoHideDuration={3000} onClose={handleSnackBarClose}>
                <Alert severity={snackbarMessage.severity} sx={{ width: '100%' }} onClose={handleSnackBarClose}>
                    <span>{snackbarMessage.message}</span>
                </Alert>
            </Snackbar>
        </div>
    )
}

export default AddTickets