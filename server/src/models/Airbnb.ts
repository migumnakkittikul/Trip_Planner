import { z } from "zod";

export const AirbnbSchema = z.object({
    airbnb_id: z.number(),
    listing_url: z.string(),
    name: z.string(),
    description: z.string(),
    neighborhood_overview: z.string(),
    picture_url: z.string(),
    latitude: z.number(),
    longitude: z.number(),
    property_type: z.string(),
    accommodates: z.number(),
    bathrooms: z.number(),
    bedrooms: z.number(),
    beds: z.number(),
    amenities: z.array(z.any()),
    price: z.number(),
    number_of_reviews: z.number(),
    review_scores_rating: z.number(),
    close_to_airport: z.string(),
    host_id: z.number(),
    host_name: z.string(),
    host_url: z.string(),
    host_response_rate: z.number(),
    host_acceptance_rate: z.number(),
    host_is_superhost: z.boolean(),
    host_identity_verified: z.boolean(),
});

export type Airbnb = z.infer<typeof AirbnbSchema>;