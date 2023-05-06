import axios from "axios";
import { Interval } from "../interfaces/Interval.interface";

async function firstIntersectionBus(start: string, end: string, busNumber: string): Promise<Interval> {
    return axios.get("http://localhost:8800/api/firstIntersection", {
        params: {
            start: start,
            end: end,
            busNumber: busNumber
        }
    })
        .then(res => res.data)
}

async function firstIntersectionDriver(start: string, end: string, driverId: string): Promise<Interval> {
    return axios.get("http://localhost:8800/api/firstIntersection", {
        params: {
            start: start,
            end: end,
            driverId: driverId
        }
    })
        .then(res => res.data)
}

export { firstIntersectionBus, firstIntersectionDriver };