import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'
import React from 'react'
import CarrierCompany from '../interfaces/CarrierCompany.interface'
import '../styles/carrierCompaniesSelect.css';
import Emoji from '../enums/Emoji.enum';

type Props = {
  carrierCompanyId: string,
  carrierCompanies: CarrierCompany[] | null,
  onCarrierCompanyChange(arg0: SelectChangeEvent<string>, child: React.ReactNode): void
}

function CarrierCompamiesSelect({ carrierCompanyId, carrierCompanies, onCarrierCompanyChange: handleCarrierCompanyChange }: Props) {
  return (
    <FormControl>
      <InputLabel id='carrier-company-label' shrink>{`Компанія перевізник ${Emoji.company}`}</InputLabel>
      <Select
        label='Компанія перевізник'
        labelId='carrier-company-label'
        onChange={handleCarrierCompanyChange}
        sx={{ width: '300px' }}
        value={carrierCompanyId ?? ''}>
        {
          carrierCompanies ?
            (
              carrierCompanies.map(company => {
                return <MenuItem key={company.id} value={company.id}>{company.name}</MenuItem>
              })
            )
            :
            (
              <MenuItem disabled>
                <em>Loading...</em>
              </MenuItem>
            )
        }
      </Select>
    </FormControl>
  )
}

export default CarrierCompamiesSelect