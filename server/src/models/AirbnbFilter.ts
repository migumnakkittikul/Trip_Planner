import { z } from 'zod';

enum PriceOrder {
    ASC = "asc",
    DESC = "desc"
}

export const AirbnbFilterSchema = z.object({
    min_price: z.coerce.number().optional(), // Automatically casts string to number
    max_price: z.coerce.number().optional(),
    close_to_airport: z.string(),
    accomodates: z.coerce.number().optional(),
    rating: z.coerce.number().optional(),
    superhost: z
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

    search_start_date: z.string(),
    search_end_date: z.string()
}).refine(data => data.min_price === undefined || data.max_price === undefined || data.min_price <= data.max_price, {
    message: "min_price should be lesser than or equal to max_price",
    path: ["min_price"]
});

export type AirbnbFilter = z.infer<typeof AirbnbFilterSchema>;
