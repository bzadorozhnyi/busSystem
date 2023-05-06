import React, { ChangeEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import Driver from '../../../interfaces/Driver.interface';
import CarrierCompany from '../../../interfaces/CarrierCompany.interface';
import Table from '../../../enums/Table.enum';
import getAll from '../../../scripts/get/getAll';
import getById from '../../../scripts/get/getById';
import CarrierCompamiesSelect from '../../../components/CarrierCompamiesSelect';
import { Alert, Button, SelectChangeEvent, Snackbar, TextField } from '@mui/material';

import updateById from '../../../scripts/update/updateById';
import "../../../styles/infoBlock.css";
import Emoji from '../../../enums/Emoji.enum';
import { SnackbarMessage } from '../../../interfaces/SnackbarMessage.interface';
import isValidDriver from '../../../fieldsValidations/isValidDriver';
import ReturnWrapper from '../../../components/ReturnWrapper';
import PageStatus from '../../../enums/PageStatus.enum';
import isExistWithId from '../../../scripts/isExistWithId';
import LoadingPage from '../../LoadingPage/LoadingPage';
import PageNotFound from '../../PageNotFound/PageNotFound';
import DriverStatistic from './DriverStatistic';

function EditDriver() {
  const [driver, setDriver] = useState<Driver | null>(null);
  const [carrierCompanies, setCarrierCompanies] = useState<CarrierCompany[] | null>(null);
  const [pageStatus, setPageStatus] = useState<PageStatus>(PageStatus.loading);
  const [snackbarMessage, setSnackbarMessage] = useState<SnackbarMessage>({
    active: false,
    message: '',
    severity: 'success'
  });
  const id = useParams().id ?? '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const isExist = await isExistWithId(Table.drivers, id);
        if (!isExist) {
          setPageStatus(PageStatus.notExist);
        }
        else {
          setPageStatus(PageStatus.exist);
        }

        const driverResponse = await getById<Driver>(Table.drivers, id);
        setDriver(driverResponse);

        const companiesResponse = await getAll<CarrierCompany>(Table.carrierCompanies);
        setCarrierCompanies(companiesResponse);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    }
    fetchData();
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

  const handleUpdateButtonClick = () => {
    if (driver) {
      const validationMessage = isValidDriver(driver);
      if (!validationMessage.valid) {
        setSnackbarMessage({
          active: true,
          message: validationMessage.message!,
          severity: 'error'
        })
        return;
      }

      let { id, ...newValue } = driver;
      try {
        updateById(Table.drivers, id ?? '', newValue)
        setSnackbarMessage({
          active: true,
          message: 'Дані оновлено',
          severity: 'success'
        });
      }
      catch(error) {
        setSnackbarMessage({
          active: true,
          message: 'Виникла помилка, дані не онвовлено!',
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
    <ReturnWrapper returnLink='/drivers'>
      <div className="info-block">
        <h1>{`Водії ${Emoji.human}`}</h1>
        <TextField
          InputLabelProps={{ shrink: true }}
          label={`Ім'я ${Emoji.human}`}
          name='name'
          onChange={handlePropertyChange}
          value={driver?.name} />
        <CarrierCompamiesSelect
          carrierCompanies={carrierCompanies}
          carrierCompanyId={driver?.carrierCompanyId ?? ''}
          onCarrierCompanyChange={handleCarrierCompanyChange} />
        <TextField
          InputLabelProps={{ shrink: true }}
          label={`Контактна інформація ${Emoji.contactInformation}`}
          name='contactInformation'
          onChange={handlePropertyChange}
          value={driver?.contactInformation} />
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
        <DriverStatistic driverId={driver?.id ?? ''} />
      </div>
    </ReturnWrapper>
  )
}

export default EditDriver