import SelectDateType from "../components/DateTimePicker/SelectDateType";
import Table from "../enums/Table.enum";
import Flight from "../interfaces/Flight.interface";
import { isInterval } from "../interfaces/Interval.interface";
import { ValidationMessage } from "../interfaces/ValidationMessage.interface";
import databaseDateString from "../scripts/databaseDateString";
import { firstIntersectionBus, firstIntersectionDriver } from "../scripts/firstIntersection";
import formatDateString from "../scripts/formatDateString";
import isExistWithId from "../scripts/isExistWithId";
import numberInRange from "../scripts/numberInRange";

async function isFlightValid(flight: Flight): Promise<ValidationMessage> {
    if (!numberInRange(flight.departurePoint.length, 1, 45)) {
        return {
            valid: false,
            message: 'Місце відправки має бути в діапазоні від 1 до 45 символів.'
        }
    }

    if (!numberInRange(flight.destinationPoint.length, 1, 45)) {
        return {
            valid: false,
            message: 'Місце прибуття має бути в діапазоні від 1 до 45 символів.'
        }
    }

    if (SelectDateType.fromISOString(flight.shippingTime).compareTo(SelectDateType.fromISOString(flight.arrivalTime)) === 1) {
        return {
            valid: false,
            message: 'Час відправки не може бути пізніше час прибуття.',
        };
    }

    if (flight.busNumber.length === 0) {
        return {
            valid: false,
            message: 'Номер автобуса не може бути пустим.'
        }
    }
    else {
        try {
            const isExist = await isExistWithId(Table.buses, flight.busNumber);
            if (!isExist) {
                return {
                    valid: false,
                    message: 'Номер автобуса не знайдено.'
                }
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Номер автобуса не знайдено.'
            }
        }
    }

    if (flight.driverId.length === 0) {
        return {
            valid: false,
            message: 'Водій повинен бути вказаний.'
        }
    }
    else {
        try {
            const isExist = await isExistWithId(Table.drivers, flight.driverId);
            if (!isExist) {
                return {
                    valid: false,
                    message: 'Водія не знайдено.'
                }
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Водія не знайдено.'
            }
        }
    }

    try {
        let intersect = await firstIntersectionBus(
            databaseDateString(flight.shippingTime),
            databaseDateString(flight.arrivalTime),
            flight.busNumber);
        if (isInterval(intersect)) {
            return {
                valid: false,
                message: `Автобус вже використовується з ${formatDateString(intersect.shippingTime)} по ${formatDateString(intersect.arrivalTime)}`
            }
        }

        intersect = await firstIntersectionDriver(
            databaseDateString(flight.shippingTime),
            databaseDateString(flight.arrivalTime),
            flight.driverId);

            if (isInterval(intersect)) {
                return {
                    valid: false,
                    message: `Водій вже працює з ${formatDateString(intersect.shippingTime)} по ${formatDateString(intersect.arrivalTime)}`
                }
            }
    }
    catch {
        return {
            valid: false,
            message: 'Виникла помилка'
        }
    }

    if (flight.cost === 0) {
        return {
            valid: false,
            message: 'Вартість повинна бути більше 0.'
        }
    }

    return {
        valid: true
    }
}

export default isFlightValid;