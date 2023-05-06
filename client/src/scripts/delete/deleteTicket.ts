import axios from "axios";

async function deleteTicket(flightId: string, seat: number) {
    const deleteResponse = await axios.delete(`http://localhost:8800/api/deleteTicket/${flightId}/${seat}`);
    return deleteResponse;
}

export default deleteTicket;