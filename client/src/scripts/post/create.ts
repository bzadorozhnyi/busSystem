import axios from "axios";
import Table from "../../enums/Table.enum";

async function create<T>(table: Table, data: T): Promise<T | null> {
    return axios.post(`http://localhost:8800/api/create/${table}`, data)
        .catch(error => {
            console.error(`Error creating ${table}`, error.response.data);
            return null;
        })
        .then(res => {
            if (res === null) {
                return null;
            }
            return res.data;
        })
}

export default create;