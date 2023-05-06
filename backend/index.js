import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import dbConfig from './dbConfig.js';

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection(dbConfig);

app.get("/api", (req, res) => {
    res.json("hello, this is backend!")
})

app.get("/api/getById/:table/:id", (req, res) => {
    const table = req.params.table;
    const id = req.params.id;

    const q = `SELECT * FROM ?? WHERE ?=id`;

    db.query(q, [table, id], (err, data) => {
        if (err) {
            return res.json(err);
        }
        else {
            return res.json(data[0]);
        }
    })
})

app.put("/api/updateById/:table/:id", async (req, res) => {
    const table = req.params.table;
    const id = req.params.id;
    const newValue = req.body;

    const keys = Object.keys(newValue);
    const values = Object.values(newValue);

    const setClause = keys.map(key => `${key} = ?`).join(", ");

    const whereClause = db.escapeId("id") + " = ?";

    const query = `UPDATE ${db.escapeId(table)} SET ${setClause} WHERE ${whereClause}`;

    db.query(query, [...values, id], (err, data) => {
        if (err) {
            return res.json(err);
        } else {
            return res.json(data);
        }
    });
});


app.post("/api/create/:table", (req, res) => {
    const table = req.params.table;
    const values = req.body;

    let q = `INSERT INTO ${db.escapeId(table)} SET ?`;

    db.query(q, values, (err, data) => {
        if (err) {
            return res.status(500).json(err);
        } else {
            return res.json(data);
        }
    });
});


app.get("/api/getFlightTickets/:flightId", (req, res) => {
    const flightId = req.params.flightId;

    const q = `SELECT tickets.buyerId AS id, tickets.seat, buyers.name, buyers.contactInformation FROM tickets
               JOIN buyers ON tickets.buyerId = buyers.id
               WHERE ?=tickets.flightId`;

    db.query(q, flightId, (err, data) => {
        if (err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})

app.get("/api/firstIntersection/", (req, res) => {
    const { start, end, busNumber } = req.query;

    const q = `SELECT shippingTime, arrivalTime 
                FROM flights
                WHERE ((shippingTime BETWEEN ? AND ?) OR
                    (arrivalTime BETWEEN ? AND ?) OR
                    (? BETWEEN shippingTime AND arrivalTime) OR
                    (? BETWEEN shippingTime AND arrivalTime)) 
                    AND busNumber = ?
                LIMIT 1`;

    db.query(q, [start, end, start, end, start, end, busNumber], (err, data) => {
        if (err) {
            return res.status(500).json(err);
        }
        else {
            return res.json(data[0]);
        }
    })
})

app.get("/api/getAll/:table/", (req, res) => {
    const table = req.params.table;

    const q = `SELECT * FROM ??`;

    db.query(q, [table], (err, data) => {
        if (err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})

app.get("/api/flightsOfBus/:id", (req, res) => {
    const id = req.params.id;

    const q = `SELECT * FROM flights WHERE busNumber=?`;

    db.query(q, id, (err, data) => {
        if (err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})

app.get("/api/flightsOfDriver/:id", (req, res) => {
    const id = req.params.id;

    const q = `SELECT * FROM flights WHERE driverId=?`;

    db.query(q, id, (err, data) => {
        if (err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})

app.get("/api/busesOfCompany/:id", (req, res) => {
    const id = req.params.id;

    const q = `SELECT * FROM buses WHERE carrierCompanyId=?`;

    db.query(q, id, (err, data) => {
        if (err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})

app.get("/api/driversOfCompany/:id", (req, res) => {
    const id = req.params.id;

    const q = `SELECT * FROM drivers WHERE carrierCompanyId=?`;

    db.query(q, id, (err, data) => {
        if (err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})

app.get("/api/ticketsOfBuyer/:id", (req, res) => {
    const id = req.params.id;

    const q = `SELECT tickets.seat,
                flights.id,
                flights.departurePoint,
                flights.destinationPoint,
                flights.shippingTime,
                flights.arrivalTime,
                flights.busNumber,
                drivers.name AS driver,
                flights.cost FROM tickets
            JOIN flights ON tickets.flightId=flights.id
            JOIN buyers ON tickets.buyerId=buyers.id
            JOIN drivers ON flights.driverId=drivers.id
            WHERE buyers.id=?
            ORDER BY tickets.seat,
                flights.departurePoint,
                flights.destinationPoint,
                flights.shippingTime,
                flights.arrivalTime;`

    db.query(q, id, (err, data) => {
        if (err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})

app.get("/api/occupiedSeats/:flightId", (req, res) => {
    const flightId = req.params.flightId;

    const q = `SELECT seat FROM tickets WHERE flightId=?`;

    db.query(q, flightId, (err, data) => {
        if (err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})

app.delete("/api/deleteTicket/:flightId/:seat", (req, res) => {
    const flightId = req.params.flightId;
    const seat = req.params.seat;

    const q = `DELETE FROM tickets WHERE flightId=? AND seat=?`;

    db.query(q, [flightId, seat], (err, data) => {
        if (err) {
            return res.json(err);
        }
        else {
            return res.json(data);
        }
    })
})


app.use('/api', (req, res, next) => {
    req.url = '/' + req.url;
    next();
})


app.listen(8800, () => {
    console.log("Connected to backend!");
})