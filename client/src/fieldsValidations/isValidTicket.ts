import Table from "../enums/Table.enum";
import Bus from "../interfaces/Bus.interface";
import Flight from "../interfaces/Flight.interface";
import { ValidationMessage } from "../interfaces/ValidationMessage.interface";
import getById from "../scripts/get/getById";
import isExistWithId from "../scripts/isExistWithId";
import numberInRange from "../scripts/numberInRange";

async function isValidTicket(ticket: { flightId: string, buyerId: string, seat: number }): Promise<ValidationMessage> {
    if (ticket.flightId.length === 0) {
        return {
            valid: false,
            message: 'Номер рейсу не може бути пустим.'
        }
    }
    else {
        try {
            const isExist = await isExistWithId(Table.flights, ticket.flightId);
            if (!isExist) {
                return {
                    valid: false,
                    message: 'Номер рейсу не знайдено.'
                }
            }
        }
        catch (error) {
            return {
                valid: false,
                message: 'Номер рейсу не знайдено.'
            }
        }
    }

    if (ticket.buyerId.length === 0) {
        return {
            valid: false,
            message: 'Користувач не може бути пустим.'
        }
    }
    else {
        try {
            const isExist = await isExistWithId(Table.buyers, ticket.buyerId);
            if (!isExist) {
                return {
                    valid: false,
                    message: 'Користувач не знайдено.'
                }
            }
        }
        catch (error) {
            return {
                valid: false,
                message: 'Користувач не знайдено.'
            }
        }
    }

    const flight = await getById<Flight>(Table.flights, ticket.flightId);
    const numberOfSeats = (await getById<Bus>(Table.buses, flight?.busNumber ?? ''))?.numberOfSeats;

    if (typeof numberOfSeats === 'undefined') {
        return {
            valid: false,
            message: `Місце в автобусі має бути в діапазоні ${numberOfSeats}`
        }
    }

    if ( !numberInRange(ticket.seat, 1, numberOfSeats!)) {
        return {
            valid: false,
            message: `Місце в автобусі має бути в діапазоні ${numberOfSeats}`
        }
    }

    return {
        valid: true
    }
}

export default isValidTicket;