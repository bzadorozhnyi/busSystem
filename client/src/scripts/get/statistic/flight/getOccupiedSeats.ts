import axios from "axios";

async function getOccupiedSeats(flightId: string) {
    try {
        const occupiedSeats = await axios.get(`http://localhost:8800/api/occupiedSeats/${flightId}`);
        return occupiedSeats.data;
    } catch (error) {
        console.error(`Error: ${error}`);
        return null;
    }
    
}

export default getOccupiedSeats;