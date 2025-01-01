import { pool } from '../db';
import { Airbnb } from '../models/Airbnb';
import { AirbnbFilter } from '../models/AirbnbFilter';

export async function getAirbnbById(airbnbId: number): Promise<Airbnb> {
    try {
        const [rows] = await pool.query('SELECT * FROM airbnb a NATURAL JOIN host h WHERE airbnb_id = ?', [airbnbId]);
        const airbnbs = rows as Airbnb[];
        return airbnbs[0] || null;
    } catch (error) {
        throw error;
    }
}

export async function getAllAirbnbs(filter: AirbnbFilter): Promise<Airbnb[]> {
    try {
        let query = `
            SELECT a.*, h.host_name, h.host_url, h.host_response_rate, h.host_acceptance_rate, 
                   h.host_is_superhost, h.host_identity_verified
            FROM airbnb a
            JOIN host h ON a.host_id = h.host_id
        `;

        const conditions: string[] = [];
        const values: any[] = [];

        conditions.push('a.close_to_airport = ?');
        values.push(filter.close_to_airport);

        if (filter.min_price !== undefined) {
            conditions.push('a.price >= ?');
            values.push(filter.min_price);
        }

        if (filter.max_price !== undefined) {
            conditions.push('a.price <= ?');
            values.push(filter.max_price);
        }

        if (filter.accomodates !== undefined) {
            conditions.push('a.accommodates >= ?');
            values.push(filter.accomodates);
        }

        if (filter.rating !== undefined) {
            conditions.push('a.review_scores_rating >= ?');
            values.push(filter.rating);
        }

        if (filter.superhost !== undefined) {
            conditions.push('h.host_is_superhost = ?');
            values.push(filter.superhost);
        }

        if (filter.search_start_date && filter.search_end_date) {
            conditions.push(`
                NOT EXISTS (
                    SELECT 1
                    FROM plan_airbnb pa
                    WHERE pa.airbnb_id = a.airbnb_id
                      AND pa.start_date <= ?
                      AND pa.end_date >= ?
                )
            `);
            values.push(filter.search_end_date);
            values.push(filter.search_start_date);
        }

        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }

        if (filter.price_order !== undefined) {
            query += ` ORDER BY a.price ${filter.price_order}`;
        }

        query += ' LIMIT ? OFFSET ?';
        values.push(filter.limit);
        values.push(filter.offset * filter.limit);

        const [rows] = await pool.query(query, values);
        const airbnbs = rows as Airbnb[];
        airbnbs.forEach((airbnb) => {
            if (airbnb.amenities) {
                airbnb.amenities = typeof airbnb.amenities === 'string' ? JSON.parse(airbnb.amenities) : airbnb.amenities;
            }
        });
        return airbnbs;
    }
    catch (error) {
        throw error;
    }
}
