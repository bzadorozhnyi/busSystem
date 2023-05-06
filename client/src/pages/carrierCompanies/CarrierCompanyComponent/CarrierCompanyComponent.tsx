import { Alert, Button, Snackbar, TextField } from '@mui/material'
import React, { ChangeEvent, useEffect, useState } from 'react'
import CarrierCompany from '../../../interfaces/CarrierCompany.interface'
import getById from '../../../scripts/get/getById';
import Table from '../../../enums/Table.enum';
import { useParams } from 'react-router-dom';
import updateById from '../../../scripts/update/updateById';
import "../../../styles/infoBlock.css";
import Emoji from '../../../enums/Emoji.enum';
import { SnackbarMessage } from '../../../interfaces/SnackbarMessage.interface';
import isValidCarrierCompany from '../../../fieldsValidations/isValidCarrierCompamy';
import ReturnWrapper from '../../../components/ReturnWrapper';
import PageStatus from '../../../enums/PageStatus.enum';
import isExistWithId from '../../../scripts/isExistWithId';
import LoadingPage from '../../LoadingPage/LoadingPage';
import PageNotFound from '../../PageNotFound/PageNotFound';
import CarrierCompanyStatisticInfo from './CarrierCompanyStatisticInfo';

function EditCarrierCompany() {
    const [company, setCompany] = useState<CarrierCompany | null>(null);
    const [pageStatus, setPageStatus] = useState<PageStatus>(PageStatus.loading);
    const [snackbarMessage, setSnackbarMessage] = useState<SnackbarMessage>({
        active: false,
        message: '',
        severity: 'success'
    });
    let carrierCompanyId = useParams().id;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const isExist = await isExistWithId(Table.carrierCompanies, carrierCompanyId ?? '');
                if (!isExist) {
                    setPageStatus(PageStatus.notExist);
                }
                else {
                    setPageStatus(PageStatus.exist);
                }

                const companyResponse = await getById<CarrierCompany>(Table.carrierCompanies, carrierCompanyId ?? '');
                setCompany(companyResponse);
            }
            catch (error) {
                console.error("Error fetching data", error);
            }
        }

        fetchData();
    }, []);

    const handleNameChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setCompany({
            ...company,
            name: event.target.value
        } as CarrierCompany)
    }

    function handleUpdateButtonClick() {
        if (company) {
            const valiationMessage = isValidCarrierCompany(company);
            if (!valiationMessage.valid) {
                setSnackbarMessage({
                    active: true,
                    message: valiationMessage.message!,
                    severity: 'error'
                });
                return;
            }

            let { id, ...newValue } = company;
            try {
                updateById(Table.carrierCompanies, company?.id ?? '', newValue)
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
        <ReturnWrapper returnLink='/carrier_companies'>
            <div className="info-block">
                <h1>{`Компанія перевізник ${Emoji.company}`}</h1>
                <TextField
                    InputLabelProps={{ shrink: true }}
                    label={`Назва ${Emoji.symbol}`}
                    onChange={handleNameChange}
                    value={company?.name} />
                <Button
                    onClick={handleUpdateButtonClick}
                    variant='outlined'>
                    Оновити
                </Button>
                <Snackbar open={snackbarMessage.active} autoHideDuration={3000} onClose={handleSnackBarClose}>
                    <Alert severity={snackbarMessage.severity} sx={{ width: '100%' }} onClose={handleSnackBarClose}>
                        <span>{snackbarMessage.message}</span>
                    </Alert>
                </Snackbar>
            </div>
            <CarrierCompanyStatisticInfo id={carrierCompanyId ?? ''} />
        </ReturnWrapper>
    )
}



export default EditCarrierCompany;