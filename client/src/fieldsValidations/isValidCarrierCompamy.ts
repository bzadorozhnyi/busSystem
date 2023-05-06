import CarrierCompany from "../interfaces/CarrierCompany.interface"
import { ValidationMessage } from "../interfaces/ValidationMessage.interface";
import isValidId from "../scripts/id/isValidId";
import numberInRange from "../scripts/numberInRange";

function isValidCarrierCompany(company: CarrierCompany): ValidationMessage {
    if (!isValidId(company.id)) {
        return {
            valid: false,
            message: 'Ідентифікатор компанії не коректний.'
        }
    }

    if (!numberInRange(company.name.length, 1, 45)) {
        return {
            valid: false,
            message: 'Назва має бути в діапазоні від 1 до 45 символів.'
        }
    }

    return {
        valid: true
    }
}

export default isValidCarrierCompany;