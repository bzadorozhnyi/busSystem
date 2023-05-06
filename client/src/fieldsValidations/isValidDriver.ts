import Table from "../enums/Table.enum";
import Driver from "../interfaces/Driver.interface"
import { ValidationMessage } from "../interfaces/ValidationMessage.interface";
import isValidId from "../scripts/id/isValidId";
import isExistWithId from "../scripts/isExistWithId";
import numberInRange from "../scripts/numberInRange";

function isValidDriver(driver: Driver): ValidationMessage {
    if (!isValidId(driver.id)) {
        return {
            valid: false,
            message: 'Ідентифікатор водія не коректний.'
        }
    }

    if (!numberInRange(driver.name.length, 1, 50)) {
        return {
            valid: false,
            message: 'Ім\'я має бути в діапазоні від 1 до 50 символів.'
        }
    }

    if (driver.carrierCompanyId.length === 0) {
        return {
            valid: false,
            message: 'Потрібно вказати компанію перевізник!'
        }
    }
    else {
        try {
            const isExist = isExistWithId(Table.carrierCompanies, driver.carrierCompanyId)
            if (!isExist) {
                return {
                    valid: false,
                    message: 'Потрібно вказати компанію перевізника!'
                }
            }
        } catch (error) {
            return {
                valid: false,
                message: 'Виникла помилка'
            }
        }
    }

    if (!numberInRange(driver.contactInformation.length, 1, 50)) {
        return {
            valid: false,
            message: 'Контактна інформація має бути в діапазоні від 1 до 50 символів.'
        }
    }

    return {
        valid: true
    }
}

export default isValidDriver;