import {z} from 'zod';
import { isValidDate, isValidTime } from '../utils/dateUtils';

enum PriceOrder {
    ASC = "asc",
    DESC = "desc"
}

export const FlightFilterSchema = z.object({
    min_fare: z.coerce.number().optional(),
    max_fare: z.coerce.number().optional(),
    date: z.string().refine(val => isValidDate(val), {
        message: "Date must be a valid date in YYYY-MM-DD format",
        path: ["date"]
    }),
    starting_airport: z.string(),
    destination_airport: z.string(),
    airline: z.string().optional(),
    departure_time_from: z.string().optional().refine(val => val === undefined || isValidTime(val), {
        message: "Departure time from should be a valid time in HH-MM-SS format",
        path: ["departure_time_from"]
    }),
    departure_time_to: z.string().optional().refine(val => val === undefined || isValidTime(val), {
        message: "Departure time to should be a valid time in HH-MM-SS format",
        path: ["departure_time_to"]
    }),
    duration: z.coerce.number().optional(),
    economy: z
    .string()
    .optional()
    .transform(val => {
        if (val === "true") return true;
        if (val === "false") return false;
        return undefined; // If the value is missing or invalid
    }),
    price_order: z.nativeEnum(PriceOrder).optional(),
    offset: z.coerce.number(), // Ensures offset is a number (coerced from string)
    limit: z.coerce.number().max(100), // Coerces and ensures max is 100
}).refine(data => data.min_fare === undefined || data.max_fare === undefined || data.min_fare <= data.max_fare, {
    message: "min_fare should be lesser than or equal to max_fare",
    path: ["min_fare"]
}).refine(data => data.departure_time_from === undefined || data.departure_time_to === undefined || data.departure_time_from <= data.departure_time_to, {
    message: "departure_time_from should be lesser than or equal to departure_time_to",
    path: ["departure_time_from"]   
});

export type FlightFilter = z.infer<typeof FlightFilterSchema>;