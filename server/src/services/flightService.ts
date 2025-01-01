import { pool } from '../db';
import { Flight } from '../models/Flight';
import { FlightFilter } from '../models/FlightFilter';

export async function getFlightById(flightId: string): Promise<Flight> {
    try {
        const [rows] = await pool.query('SELECT * FROM flight NATURAL JOIN airline WHERE flight_id = ?', [flightId]);
        const flights = rows as Flight[];
        return flights[0] || null;
    } catch (error) {
        throw error;
    }
}

export async function getAllFlights(filter: FlightFilter): Promise<Flight[]> {
    try {
        let query = 'SELECT f.* FROM flight f';
        const conditions: string[] = [];
        const values: any[] = [];

        if (filter.airline !== undefined) {
            query += ' JOIN airline a ON f.airline_id = a.airline_id';
            conditions.push('a.airline_name = ?');
            values.push(filter.airline);
        } else {
            query += ' JOIN airline a ON f.airline_id = a.airline_id';
        }

        conditions.push('f.starting_airport = ?');
        values.push(filter.starting_airport);

        conditions.push('f.destination_airport = ?');
        values.push(filter.destination_airport);

        conditions.push('f.flight_date = ?');
        values.push(filter.date);

        if (filter.min_fare !== undefined) {
            conditions.push('f.total_fare >= ?');
            values.push(filter.min_fare);
        }

        if (filter.max_fare !== undefined) {
            conditions.push('f.total_fare <= ?');
            values.push(filter.max_fare);
        }

        if (filter.duration !== undefined) {
            conditions.push('f.travel_duration <= ?');
            values.push(filter.duration);
        }

        if (filter.departure_time_from !== undefined) {
            conditions.push('f.departure_time >= ?');
            values.push(filter.departure_time_from);
        }

        if (filter.departure_time_to !== undefined) {
            conditions.push('f.departure_time <= ?');
            values.push(filter.departure_time_to);
        }

        conditions.push(`
            f.flight_id NOT IN (
                SELECT flight_id
                FROM plan_flight
                GROUP BY flight_id
                HAVING COUNT(*) >= 50
            )
        `);

        query += ' WHERE ' + conditions.join(' AND ');

        if (filter.price_order !== undefined) {
            query += ' ORDER BY f.total_fare ' + filter.price_order;
        }

        query += ' LIMIT ? OFFSET ?';
        values.push(filter.limit);
        values.push(filter.offset * filter.limit);

        const [rows] = await pool.query(query, values);
        const flights = rows as Flight[];
        return flights;
    } catch (error) {
        throw error;
    }
}
