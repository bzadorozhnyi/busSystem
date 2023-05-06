import { ChangeEvent, useEffect, useState } from "react"
import Bus from "../../interfaces/Bus.interface"
import { Alert, Button, SelectChangeEvent, Snackbar, TextField } from "@mui/material"
import Emoji from "../../enums/Emoji.enum"
import CarrierCompamiesSelect from "../../components/CarrierCompamiesSelect"
import CarrierCompany from "../../interfaces/CarrierCompany.interface"
import getAll from "../../scripts/get/getAll"
import Table from "../../enums/Table.enum"

import '../../styles/addNew.css';
import isValidBus from "../../fieldsValidations/isValidBus"
import { SnackbarMessage } from "../../interfaces/SnackbarMessage.interface"
import create from "../../scripts/post/create"
import ReturnWrapper from "../../components/ReturnWrapper"

function AddBus() {
    const [bus, setBus] = useState<Bus>({
        id: '',
        brand: '',
        carrierCompanyId: '',
        numberOfSeats: 0
    });
    const [carrierCompanies, setCarrierCompanies] = useState<CarrierCompany[] | null>(null);
    const [snackbarMessage, setSnackbarMessage] = useState<SnackbarMessage>({
        active: false,
        message: '',
        severity: 'success'
    })

    useEffect(() => {
        getAll<CarrierCompany>(Table.carrierCompanies)
            .then(res => {
                setCarrierCompanies(res);
            })
            .catch(error => {
                console.error(error);
            })
    }, [])

    const handleCarrierCompanyChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
        setBus({
            ...bus,
            carrierCompanyId: event.target.value
        } as Bus);
    }

    const handlePropertyChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBus({
            ...bus,
            [event.target.name]: event.target.value
        } as Bus);
    }

    const handleSeatNumberChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const regex = /^\d*$/;
        if (regex.test(event.target.value) && 1 <= Number(event.target.value) && Number(event.target.value) <= 100) {
            setBus({
                ...bus,
                numberOfSeats: Number(event.target.value)
            } as Bus);
        }
    }

    const handleAddButtonClick = async () => {
        const validationMessage = await isValidBus(bus);
        if (!validationMessage.valid) {
            setSnackbarMessage({
                active: true,
                message: validationMessage.message!,
                severity: 'error'
            });
        }
        else {
            create<Bus>(Table.buses, bus)
                .then(res => {
                    if (res) {
                        setSnackbarMessage({
                            active: true,
                            message: 'Автобус успішно додано',
                            severity: 'success'
                        });

                        setBus({
                            id: '',
                            brand: '',
                            carrierCompanyId: '',
                            numberOfSeats: 0
                        })
                    }
                    else {
                        setSnackbarMessage({
                            active: true,
                            message: 'Помилка при додаванні автобуса',
                            severity: 'error'
                        });
                    }
                })
                .catch(_ => {
                    setSnackbarMessage({
                        active: true,
                        message: 'Помилка при додаванні автобуса',
                        severity: 'error'
                    });
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
        <ReturnWrapper returnLink='/buses'>
            <div className="add-block">
                <h1>Новий автобус</h1>
                <TextField
                    InputLabelProps={{ shrink: true }}
                    label={`Номер автобуса ${Emoji.number}`}
                    name="id"
                    onChange={handlePropertyChange}
                    value={bus?.id}
                />
                <TextField
                    InputLabelProps={{ shrink: true }}
                    label={`Марка автобуса ${Emoji.brand}`}
                    onChange={handlePropertyChange}
                    name="brand"
                    value={bus?.brand} />
                <CarrierCompamiesSelect
                    carrierCompanies={carrierCompanies}
                    carrierCompanyId={bus?.carrierCompanyId ?? ''}
                    onCarrierCompanyChange={handleCarrierCompanyChange} />
                <TextField
                    InputLabelProps={{ shrink: true }}
                    type='number'
                    label={`Кількість місць ${Emoji.seat}`}
                    onChange={handleSeatNumberChange}
                    value={bus?.numberOfSeats}
                />
                <Button
                    onClick={handleAddButtonClick}
                    variant="outlined">
                    Створити
                </Button>
                <Snackbar open={snackbarMessage.active} autoHideDuration={3000} onClose={handleSnackBarClose}>
                    <Alert severity={snackbarMessage.severity} sx={{ width: '100%' }} onClose={handleSnackBarClose}>
                        <span>{snackbarMessage.message}</span>
                    </Alert>
                </Snackbar>
            </div>
        </ReturnWrapper>
    )
}

export default AddBus