import { z } from 'zod';

export const FlightSchema = z.object({
    flight_id: z.string(),
    flight_date: z.string(),
    starting_airport: z.string(),
    destination_airport: z.string(),
    travel_duration: z.number(),
    is_basic_economy: z.boolean(),
    total_fare: z.number(), 
    departure_time: z.string(),
    arrival_time: z.string(),
    equipment_description: z.string(),
    airline_id: z.string(),
    airline_name: z.string(),
});

export type Flight = z.infer<typeof FlightSchema>;