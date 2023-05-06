import axios from "axios";
import Flight from "../../../../interfaces/Flight.interface";

async function getFlightsOfDriver(id: string) {
    try {
        const flights = (await axios.get<Flight[]>(`http://localhost:8800/api/flightsOfDriver/${id}`)).data;
        return flights;
    } catch (error) {
        return null;
    }
}

export default getFlightsOfDriver;