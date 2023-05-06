interface Interval {
    shippingTime: string;
    arrivalTime: string;
}

function isInterval(obj: any): obj is Interval {
    if (typeof obj !== 'object') {
        return false;
    }
    console.log('is interval', obj);
    return 'shippingTime' in obj && 'arrivalTime' in obj;
}

export { type Interval, isInterval };