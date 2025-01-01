import { z } from 'zod';
import { isValidDate } from '../utils/dateUtils';

export enum SegmentTypeEnum {
    AIRBNB = 'airbnb',
    FLIGHT = 'flight',
}

export const SegmentSchema = z.object({
    plan_id: z.number().optional(),
    segment_type: z.nativeEnum(SegmentTypeEnum),
    segment_id: z.string(),
    ordinal: z.number().optional(),
    // flight_date: z.string().refine(val => isValidDate(val), {
    //     message: 'Date must be a valid date in YYYY-MM-DD format',
    //     path: ['start_date']
    // }).optional(),
    start_date: z.string().refine(val => isValidDate(val), {
        message: 'Start date must be a valid date in YYYY-MM-DD format',
        path: ['start_date']
    }).optional(),
    end_date: z.string().refine(val => isValidDate(val), {
        message: 'End date must be a valid date in YYYY-MM-DD format',
        path: ['end_date']
    }).optional()
    // close_to_airport: z.string().optional(),
    // starting_airport: z.string().optional(),
    // price: z.string().optional(),
    // total_fare: z.string().optional()
});

export type Segment = z.infer<typeof SegmentSchema>;