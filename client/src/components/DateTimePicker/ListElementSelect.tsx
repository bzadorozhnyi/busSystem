import { MenuItem, Select, SelectChangeEvent } from '@mui/material';

type listElementType = {
    id: string,
    name: string
}

type Props = {
    list: listElementType[],
    name: string,
    onChange(event: SelectChangeEvent<string>, child: React.ReactNode): void,
    value?: any
}

function ListElementSelect({ list, name, onChange, value }: Props) {
    return (
        <Select
            defaultValue={list[0].id}
            label={'fkowekf'}
            name={name}
            onChange={onChange}
            value={value?.toString() ?? list[0].id}
            >
                {
                    list.map(item => {
                        return <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                    })
                }
        </Select>
    )
}

export default ListElementSelect;