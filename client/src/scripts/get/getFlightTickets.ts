import axios from "axios";
import { Ticket } from "../../interfaces/Ticket.interface";

async function getFlightTickets(flightId: string): Promise<Ticket[] | null> {
    return axios.get<Ticket[]>(`http://localhost:8800/api/getFlightTickets/${flightId}`)
        .then(res => {
            return res.data;
        })
        .catch(error => {
            console.error(`Error getting tickets of flight ${flightId}`, error);
            return null;
        })
}

export default getFlightTickets;