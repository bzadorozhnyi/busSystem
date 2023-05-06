import Table from "../enums/Table.enum";
import Bus from "../interfaces/Bus.interface";
import { ValidationMessage } from "../interfaces/ValidationMessage.interface";
import isExistWithId from "../scripts/isExistWithId";
import numberInRange from "../scripts/numberInRange";

function isValidBusNumber(number: string): boolean {
    return /^([А-ЯІЇЄ]{2}\d{4}[А-ЯІЇЄ]{2})$/.test(number);
}

async function isValidBus(bus: Bus): Promise<ValidationMessage> {
    if (!isValidBusNumber(bus.id)) {
        return {
            valid: false,
            message: 'Номер автобусу має відповідати зразку: АБ1234ВГ'
        }
    }

    if (!numberInRange(bus.brand.length, 1, 50)) {
        return {
            valid: false,
            message: 'Марка автобуса має бути в діапазоні від 1 до 50 символів.'
        }
    }

    if (bus.carrierCompanyId.length === 0) {
        return {
            valid: false,
            message: 'Потрібно вказати компанію перевізник!'
        }
    }
    else {
        try {
            const isExist = await isExistWithId(Table.carrierCompanies, bus.carrierCompanyId);
            if (!isExist) {
                return {
                    valid: false,
                    message: 'Потрібно вказати компанію перевізника!'
                }
            }
        }
        catch (_) {
            return {
                valid: false,
                message: 'Виникла помилка'
            }
        }
    }
    
    if (!numberInRange(bus.numberOfSeats, 1, 100)) {
        return {
            valid: false,
            message: 'Кількість місць автобусу має бути в діапазоні від 1 до 100.'
        }
    }

    return {
        valid: true
    };
}

export default isValidBus;