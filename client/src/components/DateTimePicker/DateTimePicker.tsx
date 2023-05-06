import React, { useEffect, useMemo } from 'react'
import ListElementSelect from './ListElementSelect'
import generateIdNameList from './generateIdNameList'
import daysInMonth from './daysInMonth'
import { SelectChangeEvent } from '@mui/material'
import isValidDate from './isValidDate'
import SelectDateType from './SelectDateType'
import '../../styles/dateTimePicker.css'

const yearsList = generateIdNameList(1900, 2100);

const monthsList = [
    { id: '0', name: 'Січень' },
    { id: '1', name: 'Лютий' },
    { id: '2', name: 'Березень' },
    { id: '3', name: 'Квітень' },
    { id: '4', name: 'Травень' },
    { id: '5', name: 'Червень' },
    { id: '6', name: 'Липень' },
    { id: '7', name: 'Серпень' },
    { id: '8', name: 'Вересень' },
    { id: '9', name: 'Жовтень' },
    { id: '10', name: 'Листопад' },
    { id: '11', name: 'Грудень' }
]

const hours = generateIdNameList(0, 23);
const minutes = generateIdNameList(0, 59);

type Props = {
    blockName?: string,
    name: string,
    onChange(date: SelectDateType, name: string): void,
    value: SelectDateType
}

function DateTimePicker({ blockName, name, onChange, value }: Props) {
    const handlePropertyChange = (event: SelectChangeEvent<string>, child: React.ReactNode): void => {
        onChange({
            ...value,
            [event.target.name]: Number(event.target.value)
        } as SelectDateType, name);
    }

    useEffect(() => {
        if (!isValidDate(value.year, value.month, value.day)) {
            onChange({
                ...value,
                day: daysInMonth(value.year, value.month)
            } as SelectDateType, name);
        }
    }, [value])

    let daysList = useMemo(() => {
        return generateIdNameList(1, daysInMonth(value.year, value.month));
    }, [value.year, value.month]);

    return (
        <div className="date-time-picker">
            {blockName && <h4>{blockName}</h4>}
            <div className="date-time-picker-elements">
                <ListElementSelect
                    list={hours}
                    name='hours'
                    onChange={handlePropertyChange}
                    value={value.hours} />

                <ListElementSelect
                    list={minutes}
                    name='minutes'
                    onChange={handlePropertyChange}
                    value={value.minutes} />

                <ListElementSelect
                    list={daysList}
                    name='day'
                    onChange={handlePropertyChange}
                    value={value.day} />

                <ListElementSelect
                    list={monthsList}
                    name='month'
                    onChange={handlePropertyChange}
                    value={value.month} />

                <ListElementSelect
                    list={yearsList}
                    name='year'
                    onChange={handlePropertyChange}
                    value={value.year} />
            </div>
        </div>
    )
}

export default DateTimePicker