import axios from "axios";
import Flight from "../../../../interfaces/Flight.interface";

async function getFlightsOfBus(id: string) {
    try {
        const flightsOfBus = (await axios.get<Flight[]>(`http://localhost:8800/api/flightsOfBus/${id}`)).data;
        return flightsOfBus;
    }
    catch (error) {
        return 0;
    }
}

export default getFlightsOfBus;