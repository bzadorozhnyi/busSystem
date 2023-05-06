import { ChangeEvent, useState } from "react"
import CarrierCompany from "../../interfaces/CarrierCompany.interface"
import { SnackbarMessage } from "../../interfaces/SnackbarMessage.interface"
import '../../styles/addNew.css'
import { Alert, Button, Snackbar, TextField } from "@mui/material"
import Emoji from "../../enums/Emoji.enum"
import isValidCarrierCompany from "../../fieldsValidations/isValidCarrierCompamy"
import create from "../../scripts/post/create"
import Table from "../../enums/Table.enum"
import generateId from "../../scripts/id/generateId"
import ReturnWrapper from "../../components/ReturnWrapper"

function AddCarrierCompany() {
    const [company, setCompany] = useState<CarrierCompany>({
        id: generateId(),
        name: ''
    })
    const [snackbarMessage, setSnackbarMessage] = useState<SnackbarMessage>({
        active: false,
        message: '',
        severity: 'success'
    })

    const handleNameChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setCompany({
            ...company,
            name: event.target.value
        } as CarrierCompany)
    }

    const handleAdd = () => {
        const validationMessage = isValidCarrierCompany(company)
        if (!validationMessage.valid) {
            setSnackbarMessage({
                active: true,
                message: validationMessage.message!,
                severity: 'error'
            })
        }
        else {
            create<CarrierCompany>(Table.carrierCompanies, company)
                .then(res => {
                    if (res) {
                        setSnackbarMessage({
                            active: true,
                            message: 'Компанія успішно створена',
                            severity: 'success'
                        })

                        setCompany({
                            id: generateId(),
                            name: ''
                        })
                    }
                    else {
                        setSnackbarMessage({
                            active: true,
                            message: 'Помилка при додавані компанії',
                            severity: 'error'
                        })
                    }
                })
                .catch(_ => {
                    setSnackbarMessage({
                        active: true,
                        message: 'Помилка при додавані компанії',
                        severity: 'error'
                    })
                })
        }
    }

    const handleSnackBarClose = () => {
        setSnackbarMessage({
            active: false,
            message: '',
            severity: 'success'
        })
    }

    return (
        <ReturnWrapper returnLink='/carrier_companies'>
            <div className="add-block">
                <h1>Нова компанія</h1>
                <TextField
                    InputLabelProps={{ shrink: true }}
                    label={`Назва компанії ${Emoji.company}`}
                    name="name"
                    onChange={handleNameChange}
                    value={company.name}
                />
                <Button
                    onClick={handleAdd}
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

export default AddCarrierCompany