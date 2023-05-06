import React, { ChangeEvent, useEffect, useState } from 'react'
import Bus from '../../../interfaces/Bus.interface';
import { Alert, Button, SelectChangeEvent, Snackbar, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import CarrierCompany from '../../../interfaces/CarrierCompany.interface';
import Table from '../../../enums/Table.enum';
import getAll from '../../../scripts/get/getAll';
import getById from '../../../scripts/get/getById';
import updateById from '../../../scripts/update/updateById';
import CarrierCompamiesSelect from '../../../components/CarrierCompamiesSelect';
import '../../../styles/infoBlock.css';
import Emoji from '../../../enums/Emoji.enum';
import isValidBus from '../../../fieldsValidations/isValidBus';
import { SnackbarMessage } from '../../../interfaces/SnackbarMessage.interface';
import ReturnWrapper from '../../../components/ReturnWrapper';
import isExistWithId from '../../../scripts/isExistWithId';
import PageNotFound from '../../PageNotFound/PageNotFound';
import LoadingPage from '../../LoadingPage/LoadingPage';
import PageStatus from '../../../enums/PageStatus.enum';
import BusStatisticInfo from './BusStatisticInfo';

function EditBus() {
    const [bus, setBus] = useState<Bus | null>(null);
    const [carrierCompanies, setCarrierCompanies] = useState<CarrierCompany[] | null>(null);
    const [pageStatus, setPageStatus] = useState<PageStatus>(PageStatus.loading);
    const [snackbarMessage, setSnackbarMessage] = useState<SnackbarMessage>({
        active: false,
        message: '',
        severity: 'success'
    });
    const busNumber = useParams().busNumber;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const isExist = await isExistWithId(Table.buses, busNumber!)
                if (!isExist) {
                    setPageStatus(PageStatus.notExist);
                }
                else {
                    setPageStatus(PageStatus.exist);
                }

                const busResponse = await getById<Bus>(Table.buses, busNumber!);
                setBus(busResponse);

                const companiesResponse = await getAll<CarrierCompany>(Table.carrierCompanies);
                setCarrierCompanies(companiesResponse);
            } catch (error) {
                console.error("Error fetching data", error);
            }
        }
        fetchData();
    }, [])

    const handleBrandChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBus({
            ...bus,
            brand: event.target.value
        } as Bus)
    }

    const handleCarrierCompanyChange = (event: SelectChangeEvent<string>, child: React.ReactNode) => {
        setBus({
            ...bus,
            carrierCompanyId: event.target.value
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

    const handleUpdateButtonClick = async () => {
        if (bus) {
            const validationMessage = await isValidBus(bus);
            if (!validationMessage.valid) {
                setSnackbarMessage({
                    active: true,
                    message: validationMessage.message!,
                    severity: 'error'
                })
                return;
            }

            let { id, ...newValue } = bus;
            try {
                await updateById(Table.buses, busNumber ?? '', newValue);
                setSnackbarMessage({
                    active: true,
                    message: 'Дані оновлено!',
                    severity: 'success'
                })
            }
            catch (error) {
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
        <ReturnWrapper returnLink={'/buses'}>
            <div className="info-block">
                <h1>{`Автобус ${Emoji.bus}`}</h1>
                <TextField
                    disabled
                    InputLabelProps={{ shrink: true }}
                    label={`Номер автобуса ${Emoji.number}`}
                    value={bus?.id}
                />
                <TextField
                    InputLabelProps={{ shrink: true }}
                    label={`Марка автобуса ${Emoji.brand}`}
                    onChange={handleBrandChange}
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
            <div>
                <BusStatisticInfo busNumber={bus?.id ?? ''} />
            </div>
        </ReturnWrapper>
    )
}

export default EditBus;