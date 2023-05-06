import { ChangeEvent, useState } from "react"
import Buyer from "../../interfaces/Buyer.interface"
import generateId from "../../scripts/id/generateId"
import "../../styles/addNew.css"
import { Alert, Button, Snackbar, TextField } from "@mui/material"
import Emoji from "../../enums/Emoji.enum"
import { SnackbarMessage } from "../../interfaces/SnackbarMessage.interface"
import isValidBuyer from "../../fieldsValidations/isValidBuyer"
import Table from "../../enums/Table.enum"
import create from "../../scripts/post/create"
import ReturnWrapper from "../../components/ReturnWrapper"

function AddBuyer() {
    const [buyer, setBuyer] = useState<Buyer>({
        id: generateId(),
        name: '',
        contactInformation: ''
    })
    const [snackbarMessage, setSnackbarMessage] = useState<SnackbarMessage>({
        active: false,
        message: '',
        severity: 'success'
    })

    const handlePropertyChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        setBuyer({
            ...buyer,
            [event.target.name]: event.target.value
        } as Buyer)
    }

    const handleAddButtonClick = () => {
        const validationMessage = isValidBuyer(buyer);
        if (!validationMessage.valid) {
            setSnackbarMessage({
                active: true,
                message: validationMessage.message!,
                severity: 'error'
            })
        }
        else {
            create<Buyer>(Table.buyers, buyer)
                .then(res => {
                    if (res) {
                        setSnackbarMessage({
                            active: true,
                            message: 'Покупця успішно додано',
                            severity: 'success'
                        })

                        setBuyer({
                            id: generateId(),
                            name: '',
                            contactInformation: ''
                        })
                    }
                    else {
                        setSnackbarMessage({
                            active: true,
                            message: 'Помилка при додаванні покупця',
                            severity: 'error'
                        });
                    }
                })
                .catch(_ => {
                    setSnackbarMessage({
                        active: true,
                        message: 'Помилка при додаванні покупця',
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
        <ReturnWrapper returnLink='/buyers'>
            <div className="add-block">
                <h1>Новий покупець</h1>
                <TextField
                    InputLabelProps={{ shrink: true }}
                    label={`Ім'я ${Emoji.human}`}
                    name='name'
                    onChange={handlePropertyChange}
                    value={buyer.name}
                />
                <TextField
                    InputLabelProps={{ shrink: true }}
                    label={`Контактна інформація ${Emoji.contactInformation}`}
                    name='contactInformation'
                    onChange={handlePropertyChange}
                    value={buyer.contactInformation} />
                <Button
                    onClick={handleAddButtonClick}
                    variant='outlined'>
                    Оновити
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

export default AddBuyer