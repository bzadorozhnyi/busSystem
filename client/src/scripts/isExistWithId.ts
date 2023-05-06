import Table from "../enums/Table.enum";
import getById from "./get/getById";

async function isExistWithId(table: Table, id: string): Promise<boolean> {
    return getById(table, id).then(res => {
        if (res) {
            return true;
        }
        return false;
    });
}

export default isExistWithId;