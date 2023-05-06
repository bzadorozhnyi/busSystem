import axios from "axios";
import Bus from "../../../../interfaces/Bus.interface";

async function getBusesofCompany(id: string): Promise<Bus[] | null> {
    try {
        const buses = (await axios.get<Bus[]>(`http://localhost:8800/api/busesOfCompany/${id}`)).data;
        return buses;
    }
    catch (error) {
        return null;
    }
}

export default getBusesofCompany;