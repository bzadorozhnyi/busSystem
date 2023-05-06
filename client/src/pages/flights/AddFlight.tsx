import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react"
import Flight from "../../interfaces/Flight.interface"
import generateId from "../../scripts/id/generateId"
import Bus from "../../interfaces/Bus.interface";
import Driver from "../../interfaces/Driver.interface";
import getAll from "../../scripts/get/getAll";
import Table from "../../enums/Table.enum";
import { Alert, Autocomplete, Button, Snackbar, TextField } from "@mui/material";
import Emoji from "../../enums/Emoji.enum";
import DateTimePicker from "../../components/DateTimePicker/DateTimePicker";
import SelectDateType from "../../components/DateTimePicker/SelectDateType";
import isValidFlight from "../../fieldsValidations/isValidFlight";
import { SnackbarMessage } from "../../interfaces/SnackbarMessage.interface";
import create from "../../scripts/post/create";
import ReturnWrapper from "../../components/ReturnWrapper";

interface AutocompleteOptions {
    id: string;
    label: string;
}

function AddFlight() {
    const [flight, setFlight] = useState<Flight>({
        id: generateId(),
        busNumber: '',
        driverId: '',
        departurePoint: '',
        destinationPoint: '',
        shippingTime: new Date().toISOString(),
        arrivalTime: new Date().toISOString(),
        cost: 0
    });
    const [busesLabels, setBusesLabels] = useState<AutocompleteOptions[]>([]);
    const [driversLabels, setDriversLabels] = useState<AutocompleteOptions[]>([]);
    const [snackbarMessage, setSnackbarMessage] = useState<SnackbarMessage>({
        active: false,
        message: '',
        severity: 'success'
    })

    useEffect(() => {
        getAll<Bus>(Table.buses)
            .then(res => {
                if (res) {
                    const options = res.map(bus => {
                        return {
                            id: bus.id,
                            label: bus.id
                        }
                    })
                    setBusesLabels(options);
                }
            })
            .catch(error => {
                console.error(error);
            })

        getAll<Driver>(Table.drivers)
            .then(res => {
                if (res) {
                    const options = res.map(driver => {
                        return {
                            id: driver.id,
                            label: `${driver.name}, ${driver.contactInformation}`
                        }
                    })
                    setDriversLabels(options);
                }
            })
            .catch(error => {
                console.error(error);
            })
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

    const handleBusChange = (event: SyntheticEvent<Element, Event>, value: AutocompleteOptions | null): void => {
        setFlight({
            ...flight,
            busNumber: value?.id ?? ''
        } as Flight);
    }

    const handleDriverChange = (event: SyntheticEvent<Element, Event>, value: AutocompleteOptions | null): void => {
        setFlight({
            ...flight,
            driverId: value?.id ?? ''
        } as Flight);
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

    const handleAddButtonClick = async () => {
        const newFlight = flight;
        newFlight.shippingTime = SelectDateType.fromISOString(newFlight.shippingTime).toDataBaseISOString();
        newFlight.arrivalTime = SelectDateType.fromISOString(newFlight.arrivalTime).toDataBaseISOString();

        const validationMessage = await isValidFlight(newFlight);
        if (!validationMessage.valid) {
            setSnackbarMessage({
                active: true,
                message: validationMessage.message!,
                severity: 'error'
            })
        }
        else {
            try {
                const res = await create<Flight>(Table.flights, newFlight);
                if (res) {
                    setSnackbarMessage({
                        active: true,
                        message: 'Рейс додано',
                        severity: 'success'
                    })

                    setFlight({
                        ...flight,
                        id: generateId(),
                        departurePoint: '',
                        destinationPoint: '',
                        cost: 0
                    });
                }
                else {
                    setSnackbarMessage({
                        active: true,
                        message: 'Помилка при додаванні рейсу',
                        severity: 'error'
                    });
                }
            } catch (error) {
                setSnackbarMessage({
                    active: true,
                    message: 'Помилка при додаванні рейсу',
                    severity: 'error'
                });
            }
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
        <ReturnWrapper returnLink='/flights'>
            <div className="add-block">
                <h1>Новий рейс</h1>
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
                    name={"shippingTime"}
                    onChange={handleDateTimeChange}
                    value={SelectDateType.fromISOString(flight.shippingTime)} />
                <DateTimePicker
                    blockName={`Час прибуття ${Emoji.time}`}
                    name={"arrivalTime"}
                    onChange={handleDateTimeChange}
                    value={SelectDateType.fromISOString(flight.arrivalTime)} />
                <Autocomplete
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    options={busesLabels ?? []}
                    sx={{ width: '300px' }}
                    onChange={handleBusChange}
                    renderInput={(params) => <TextField
                        {...params}
                        InputLabelProps={{ shrink: true }}
                        label="Автобус" />}
                />
                <Autocomplete
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    options={driversLabels ?? []}
                    sx={{ width: '300px' }}
                    onChange={handleDriverChange}
                    renderInput={(params) => <TextField
                        {...params}
                        InputLabelProps={{ shrink: true }}
                        label="Водій" />}
                />
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
                    onClick={handleAddButtonClick}>
                    Створити
                </Button>

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

export default AddFlight