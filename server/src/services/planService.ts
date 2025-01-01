import { pool } from '../db';
import { Plan } from '../models/Plan';
import { Segment, SegmentTypeEnum } from '../models/Segment';
import mysql from 'mysql2/promise';

export async function getPlansByUserId(userId: number): Promise<Plan[]> {
    try {
        const [rows] = await pool.query('SELECT * FROM plan WHERE user_id = ?', [userId]);
        return rows as Plan[];
    } catch (error) {
        throw error;
    }
}

export async function getPlanByIdMini(planId: number): Promise<Plan> {
    try {
        const [rows] = await pool.query('SELECT * FROM plan WHERE plan_id = ?', [planId]);
        const plans = rows as Plan[];
        return plans[0];
    } catch (error) {
        throw error;
    }
}

export async function getPlanById(planId: number): Promise<Plan> {
    try {
        const [rows] = await pool.query('SELECT * FROM plan WHERE plan_id = ?', [planId]);
        const plans = rows as Plan[];
        let plan: Plan | undefined = plans[0];
        const [flights]: [any, any] = await pool.query('SELECT pf.*, f.starting_airport, f.destination_airport, f.total_fare, DATE_FORMAT(f.flight_date, "%Y-%m-%d") AS flight_date FROM plan_flight pf JOIN flight f ON pf.flight_id = f.flight_id WHERE plan_id = ?', [planId]);
        const [airbnbs]: [any, any] = await pool.query('SELECT pa.*, a.close_to_airport, a.price FROM plan_airbnb pa JOIN airbnb a ON pa.airbnb_id = a.airbnb_id WHERE plan_id = ?', [planId]);

        const flightSegments: Segment[] = flights.map((flight: any) => {
            const { flight_id, plan_id, ...rest } = flight;
            return {
                ...rest,
                segment_id: String(flight_id),
                segment_type: SegmentTypeEnum.FLIGHT,
            };
        });

        const airbnbSegments: Segment[] = airbnbs.map((airbnb: any) => {
            const { airbnb_id, plan_id, ...rest } = airbnb;
            return {
                ...rest,
                segment_id: String(airbnb_id),
                segment_type: SegmentTypeEnum.AIRBNB,
                start_date: rest.start_date.toISOString().slice(0, 10),
                end_date: rest.end_date.toISOString().slice(0, 10)
            };
        });

        const segments: Segment[] = [...flightSegments, ...airbnbSegments].sort((a, b) => {
            if (a.ordinal && b.ordinal) {
                return a.ordinal - b.ordinal;
            }
            return 0;
        });

        if (plan) {
            plan.segments = segments;
        }
        return plan;
    } catch (error) {
        throw error;
    }
}

export async function createPlan(plan: Plan, userId: number): Promise<Plan> {
    let planId: number;
    try {
        const { plan_name, plan_description, segments } = plan;
        const [result]: [any, any] = await pool.query('INSERT INTO plan (plan_name, plan_description, user_id) VALUES (?, ?, ?)', [plan_name, plan_description, userId]);
        planId = result.insertId;
    } catch (error) {
        throw error;
    }
    return { plan_id: planId, ...plan};
}

export async function deletePlan(planId: number): Promise<void> {
    try {
        await pool.query('DELETE FROM plan_flight WHERE plan_id = ?', [planId]);
        await pool.query('DELETE FROM plan_airbnb WHERE plan_id = ?', [planId]);
        await pool.query('DELETE FROM plan WHERE plan_id = ?', [planId]);
    } catch (error) {
        throw error;
    }
}

export async function updatePlan(planId: number, plan: Plan): Promise<Plan> {
    try{
        const { plan_name, plan_description } = plan;
        await pool.query('UPDATE plan SET plan_name = ?, plan_description = ? WHERE plan_id = ?', [plan_name, plan_description, planId]);
    }
    catch (error) {
        throw error;
    }
    return {plan_id: planId, ...plan};
}

export async function addSegment(planId: number, segment: Segment): Promise<void> {
    try {
        const { segment_type, segment_id, start_date, end_date } = segment;
        let temp = null;
        if (segment_type === SegmentTypeEnum.FLIGHT) {
            temp = await pool.query('CALL insert_flight(?, ?)', [planId, segment_id]);
        } else {
            temp = await pool.query('CALL insert_airbnb(?, ?, ?, ?)', [planId, Number(segment_id), start_date, end_date]);
        }
        // console.log(temp);
    }
    catch (error) {
        throw error;
    }
}

export async function deleteSegment(planId: number, segmentId: string): Promise<void> {
    try {
        const [rows1] = await pool.query('DELETE from plan_flight WHERE plan_id = ? AND flight_id = ?', [planId, segmentId]);
        if(!isNaN(Number(segmentId))) {
            const [rows2] = await pool.query('DELETE from plan_airbnb WHERE plan_id = ? AND airbnb_id = ?', [planId, Number(segmentId)]);
        }
    }
    catch (error) {
        throw error;
    }
}