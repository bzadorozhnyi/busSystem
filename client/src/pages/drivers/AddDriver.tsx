import { ChangeEvent, useEffect, useState } from "react"
import Driver from "../../interfaces/Driver.interface"
import generateId from "../../scripts/id/generateId"
import CarrierCompany from "../../interfaces/CarrierCompany.interface";
import getAll from "../../scripts/get/getAll";
import Table from "../../enums/Table.enum";
import { Alert, Button, SelectChangeEvent, Snackbar, TextField } from "@mui/material";
import Emoji from "../../enums/Emoji.enum";
import CarrierCompamiesSelect from "../../components/CarrierCompamiesSelect";
import { SnackbarMessage } from "../../interfaces/SnackbarMessage.interface";
import isValidDriver from "../../fieldsValidations/isValidDriver";
import create from "../../scripts/post/create";
import ReturnWrapper from "../../components/ReturnWrapper";

function AddDriver() {
    const [driver, setDriver] = useState<Driver>({
        id: generateId(),
        name: '',
        carrierCompanyId: '',
        contactInformation: ''
    });
    const [carrierCompanies, setCarrierCompanies] = useState<CarrierCompany[] | null>(null);
    const [snackbarMessage, setSnackbarMessage] = useState<SnackbarMessage>({
        active: false,
        message: '',
        severity: 'success'
    });

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
        setDriver({
            ...driver,
            carrierCompanyId: event.target.value
        } as Driver);
    }

    const handlePropertyChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setDriver({
            ...driver,
            [event.target.name]: event.target.value
        } as Driver)
    }

    const handleAddButtonClick = () => {
        const validationMessage = isValidDriver(driver);
        if (!validationMessage.valid) {
            setSnackbarMessage({
                active: true,
                message: validationMessage.message!,
                severity: 'error'
            });
        }
        else {
            create<Driver>(Table.drivers, driver)
                .then(res => {
                    if (res) {
                        setSnackbarMessage({
                            active: true,
                            message: 'Водія успішно додано',
                            severity: 'success'
                        });

                        setDriver({
                            id: generateId(),
                            name: '',
                            carrierCompanyId: '',
                            contactInformation: ''
                        })
                    }
                    else {
                        setSnackbarMessage({
                            active: true,
                            message: 'Помилка при додаванні водія',
                            severity: 'error'
                        });
                    }
                })
                .catch(_ => {
                    setSnackbarMessage({
                        active: true,
                        message: 'Помилка при додаванні водія',
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
        <ReturnWrapper returnLink='/drivers'>
            <div className="add-block">
                <h1>Новий водій</h1>
                <TextField
                    InputLabelProps={{ shrink: true }}
                    label={`Ім'я ${Emoji.human}`}
                    name='name'
                    onChange={handlePropertyChange}
                    value={driver.name}
                />
                <CarrierCompamiesSelect
                    carrierCompanies={carrierCompanies}
                    carrierCompanyId={driver?.carrierCompanyId ?? ''}
                    onCarrierCompanyChange={handleCarrierCompanyChange} />
                <TextField
                    InputLabelProps={{ shrink: true }}
                    label={`Контактна інформація ${Emoji.contactInformation}`}
                    name='contactInformation'
                    onChange={handlePropertyChange}
                    value={driver.contactInformation} />
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
        </ReturnWrapper>
    )

}

export default AddDriver