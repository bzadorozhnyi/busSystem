import axios from "axios";

async function getTicketsOfBuyer(id: string) {
    try {
        const tickets = (await axios.get(`http://localhost:8800/api/ticketsOfBuyer/${id}`)).data;
        return tickets;
    } catch (error) {
        console.error(`Error fetching tickets of buyer: ${id}`, error);
        return null;
    }
    
}

export default getTicketsOfBuyer;