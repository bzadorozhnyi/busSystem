import axios from "axios";
import Table from "../../enums/Table.enum";

async function getAll<T>(table: Table): Promise<T[] | null> {
    return axios.get<T[]>(`http://localhost:8800/api/getAll/${table}`)
        .then(res => {
            return res.data;
        })
        .catch(error => {
            console.error(`Error getting all from ${table}`, error);
            return null;
        });
}

export default getAll;