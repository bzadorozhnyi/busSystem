import axios from "axios";
import Driver from "../../../../interfaces/Driver.interface";

async function getDriversOfCompany(id: string): Promise<Driver[] | null> {
    try {
        const drivers = (await axios.get<Driver[]>(`http://localhost:8800/api/driversOfCompany/${id}`)).data;
        return drivers;
    }
    catch (error) {
        return null;
    }
}

export default getDriversOfCompany;