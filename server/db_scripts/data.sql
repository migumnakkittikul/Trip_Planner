-- Insert data into host table
INSERT INTO host (host_id, host_url, host_name, host_response_rate, host_acceptance_rate, host_is_superhost, host_identity_verified)
VALUES
    (1, 'http://example.com/host1', 'Alice Johnson', 95.5, 88.7, TRUE, TRUE),
    (2, 'http://example.com/host2', 'Bob Smith', 80.3, 70.4, FALSE, TRUE);

-- Insert data into airline table
INSERT INTO airline (airline_id, airline_name)
VALUES
    ('AA', 'American Airlines'),
    ('DL', 'Delta Airlines');

-- Insert data into user table
INSERT INTO user (user_name, phone, email)
VALUES
    ('John Doe', '1234567890', 'johndoe@example.com'),
    ('Jane Smith', '9876543210', 'janesmith@example.com');

-- Insert data into flight table
INSERT INTO flight (flight_id, flight_date, starting_airport, destination_airport, travel_duration, is_basic_economy, total_fare, departure_time, arrival_time, equipment_description, airline_id)
VALUES
    ('FL123', '2024-12-01', 'ORD', 'LAX', 4.5, TRUE, 300.00, '08:00:00', '12:30:00', 'Boeing 737', 'AA'),
    ('FL456', '2024-12-05', 'LAX', 'ORD', 4.5, FALSE, 350.00, '15:00:00', '19:30:00', 'Boeing 737', 'DL');

-- Insert data into airbnb table
INSERT INTO airbnb (airbnb_id, listing_url, name, description, neighborhood_overview, picture_url, latitude, longitude, property_type, accommodates, bathrooms, bedrooms, beds, amenities, price, number_of_reviews, review_scores_rating, close_to_airport, host_id)
VALUES
    (1, 'http://example.com/listing1', 'Cozy Cottage', 'A small cozy cottage near the airport.', 'Quiet neighborhood.', 'http://example.com/image1', 40.712776, -74.005974, 'Cottage', 4, 1, 2, 2, '["WiFi", "Kitchen", "Free Parking"]', 120, 30, 4.5, 'ORD', 1),
    (2, 'http://example.com/listing2', 'Modern Apartment', 'Spacious modern apartment in the city.', 'Bustling neighborhood.', 'http://example.com/image2', 34.052235, -118.243683, 'Apartment', 6, 2, 3, 3, '["WiFi", "Air Conditioning", "Pool"]', 200, 50, 4.7, 'LAX', 2);

-- Insert data into plan table
INSERT INTO plan (plan_name, plan_description, user_id)
VALUES
    ('Vacation to LA', 'A relaxing vacation in Los Angeles.', 1),
    ('Business Trip to Chicago', 'Attending a conference in Chicago.', 2);

-- Call insert_airbnb procedure to insert the first set of data
CALL insert_airbnb(1, 1, '2024-11-29', '2024-11-30'); -- Plan 1: Stay at Airbnb A1 (first stay)
CALL insert_airbnb(2, 2, '2024-12-01', '2024-12-03'); -- Plan 2: Stay at Airbnb A2 (first stay)

-- Call insert_flight procedure to insert flight data
CALL insert_flight(1, 'FL123'); -- Plan 1: Take flight F1 (second part of trip)
CALL insert_flight(2, 'FL456'); -- Plan 2: Take flight F2 (second part of trip)

-- Call insert_airbnb procedure to insert the second set of data
CALL insert_airbnb(1, 2, '2024-12-07', '2024-12-08'); -- Plan 1: Stay at Airbnb A2 (third stay)
CALL insert_airbnb(2, 1, '2024-12-07', '2024-12-09'); -- Plan 2: Stay at Airbnb A1 (third stay)