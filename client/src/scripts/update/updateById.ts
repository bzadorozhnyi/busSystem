import axios from "axios";
import Table from "../../enums/Table.enum";

async function updateById(table: Table, id: string, newValue: Object) {
    return axios.put(`http://localhost:8800/api/updateById/${table}/${id}`,
        {
            ...newValue
        })
        .then(res => {
            return res.data;
        })
        .catch(error => {
            console.error(`Error updating ${id} in ${table} with newValue`, error);
            return `Error updating ${id} in ${table} with newValue`;
        })
}

export default updateById;