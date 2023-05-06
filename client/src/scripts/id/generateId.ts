import {v4 as uudidv4} from 'uuid';

function generateId(): string {
    return uudidv4();
}

export default generateId;