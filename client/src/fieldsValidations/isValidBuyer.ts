import Buyer from "../interfaces/Buyer.interface"
import { ValidationMessage } from "../interfaces/ValidationMessage.interface";
import isValidId from "../scripts/id/isValidId";
import numberInRange from "../scripts/numberInRange";

function isValidBuyer(buyer: Buyer): ValidationMessage {
    if (!isValidId(buyer.id)) {
        return {
            valid: false,
            message: 'Ідентифікатор покупця не коректний.'
        }
    }
    
    if (!numberInRange(buyer.name.length, 1, 50)) {
        return {
            valid: false,
            message: 'Ім\'я має бути в діапазоні від 1 до 50 символів.'
        }
    }

    if (!numberInRange(buyer.contactInformation.length, 1, 50)) {
        return {
            valid: false,
            message: 'Контактна інформація має бути в діапазоні від 1 до 50 символів.'
        }
    }

    return {
        valid: true
    }
}

export default isValidBuyer;