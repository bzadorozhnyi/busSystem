import axios from "axios";
import Table from "../../enums/Table.enum";

async function getById<T>(table: Table, id: string): Promise<T | null> {
    return axios.get<T>(`http://localhost:8800/api/getById/${table}/${id}`)
        .then(res => {
            return res.data
        })
        .catch(error => {
            console.error(`Error getting object with id ${id} from ${table}`, error);
            return null;
        })
}

export default getById;