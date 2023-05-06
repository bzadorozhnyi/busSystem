import { ChangeEvent, useEffect, useState } from 'react'
import Buyer from '../../../interfaces/Buyer.interface';
import { useParams } from 'react-router-dom';
import getById from '../../../scripts/get/getById';
import Table from '../../../enums/Table.enum';
import updateById from '../../../scripts/update/updateById';
import { Alert, Button, Snackbar, TextField } from '@mui/material';

import "../../../styles/infoBlock.css";
import Emoji from '../../../enums/Emoji.enum';
import { SnackbarMessage } from '../../../interfaces/SnackbarMessage.interface';
import isValidBuyer from '../../../fieldsValidations/isValidBuyer';
import ReturnWrapper from '../../../components/ReturnWrapper';
import PageStatus from '../../../enums/PageStatus.enum';
import LoadingPage from '../../LoadingPage/LoadingPage';
import PageNotFound from '../../PageNotFound/PageNotFound';
import isExistWithId from '../../../scripts/isExistWithId';
import BuyerStatistic from './BuyerStatistic';

function EditBuyer() {
    const [buyer, setBuyer] = useState<Buyer | null>(null);
    const [pageStatus, setPageStatus] = useState<PageStatus>(PageStatus.loading);
    const [snackbarMessage, setSnackbarMessage] = useState<SnackbarMessage>({
        active: false,
        message: '',
        severity: 'success'
    });

    let id = useParams().id;

    useEffect(() => {
        const fetchData = async () => {
            const isExist = await isExistWithId(Table.buyers, id ?? '');
            if (!isExist) {
                setPageStatus(PageStatus.notExist);
            }
            else {
                setPageStatus(PageStatus.exist);
            }

            const buyerResponse = await getById<Buyer>(Table.buyers, id ?? '');
            setBuyer(buyerResponse);
        }

        fetchData();
    }, [])

    const handlePropertyChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setBuyer({
            ...buyer,
            [event.target.name]: event.target.value
        } as Buyer)
    }

    const handleUpdateButtonClick = async () => {
        if (buyer) {
            const validationMessage = isValidBuyer(buyer)
            if (!validationMessage.valid) {
                setSnackbarMessage({
                    active: true,
                    message: validationMessage.message!,
                    severity: 'error'
                });
                return;
            }

            let { id, ...newValue } = buyer;
            try {
                await updateById(Table.buyers, buyer?.id ?? '', newValue);
                setSnackbarMessage({
                    active: true,
                    message: "Дані оновлено!",
                    severity: 'success'
                });
            } catch (error) {
                setSnackbarMessage({
                    active: true,
                    message: "Виникла помилка, дані не оновлено!",
                    severity: 'error'
                });
                console.error('update error', error);
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

    if (pageStatus === PageStatus.loading) {
        return <LoadingPage />
    }
    else if (pageStatus === PageStatus.notExist) {
        return <PageNotFound />
    }

    return (
        <ReturnWrapper returnLink={'/buyers'}>
            <div className="info-block">
                <h1>{`Покупець ${Emoji.money}`}</h1>
                <TextField
                    InputLabelProps={{ shrink: true }}
                    label={`Ім'я ${Emoji.human}`}
                    name='name'
                    onChange={handlePropertyChange}
                    value={buyer?.name} />
                <TextField
                    InputLabelProps={{ shrink: true }}
                    label={`Контактна інформація ${Emoji.contactInformation}`}
                    name='contactInformation'
                    onChange={handlePropertyChange}
                    value={buyer?.contactInformation} />
                <Button
                    onClick={handleUpdateButtonClick}
                    variant="outlined">
                    Оновити
                </Button>
                <Snackbar open={snackbarMessage.active} autoHideDuration={3000} onClose={handleSnackBarClose}>
                    <Alert severity={snackbarMessage.severity} sx={{ width: '100%' }} onClose={handleSnackBarClose}>
                        {
                            <span>{snackbarMessage.message}</span>
                        }
                    </Alert>
                </Snackbar>
            </div>
            <div>
                <BuyerStatistic id={buyer?.id ?? ''} />
            </div>
        </ReturnWrapper>
    )
}

export default EditBuyer