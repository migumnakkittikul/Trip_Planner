import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
// import { DateRange } from 'react-date-range';

export default function AddSegmentPage() {
  const [activeTab, setActiveTab] = useState("airbnb");
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({
    rating: 3,
    offset: 0,
    limit: 10,
    close_to_airport: "",
  });
  const [isRatingActive, setIsRatingActive] = useState(false);

  const [fromDate, setFromDate] = useState("");
  const lastSixMonthsStart = "2022-07-01"; // Start of July 2022
  const lastSixMonthsEnd = "2022-12-31"; // End of December 2022

  const navigate = useNavigate();
  const { id } = useParams();

  const addToPlan = async (segmentID) => {
    try {
      
      console.log(filters.search_start_date + " " + filters.search_end_date)
      const response = await fetch(`https://travel-planner-440113.uc.r.appspot.com/plans/${id}/segment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan_id: Number(id),
          segment_type: activeTab,
          segment_id: String(segmentID),
          start_date: filters.search_start_date,
          end_date: filters.search_end_date
        }),
      });
      if (response.ok) {
        // navigate(`/plans/${id}`);
        toast.success((activeTab === "flight" ? "Flight" : "Airbnb") + " added successfully");
      }
      else if(response.status === 400) {
        const message = await response.json();
        toast.error(message.message);
      } 
      else {
        throw new Error("An unexpected error occurred");
      }
    } catch (error) {
      console.error(error + ", try again");
      toast.error("An unexpected error occurred, try again");
    }
  }

  const fetchItems = async (tab) => {
    try {
      console.log(filters);
      const url =
        tab === "airbnb"
          ? "https://travel-planner-440113.uc.r.appspot.com/airbnbs"
          : "https://travel-planner-440113.uc.r.appspot.com/flights";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });

      if (!response.ok) {
        throw new Error("Error fetching data");
      }
      const data = await response.json();
      if (data.data.length === 0) {
        toast.error("No " + activeTab + " found for the given filters");
      }
      // console.log("fetchitems: ", data);
      setItems(data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    console.log(filters);
    // Trigger fetchItems whenever filters change
    if (activeTab === "airbnb" && filters.close_to_airport !== "" && filters.search_start_date !== "" && filters.search_end_date !== "") {
      if(filters.search_start_date > filters.search_end_date) {
        toast.error("Start date should be less than end date");
      }
      else
        fetchItems("airbnb");
    }
    else if (
      activeTab === "flight" &&
      filters.starting_airport !== "" &&
      filters.destination_airport !== "" &&
      filters.date !== ""
    )
      fetchItems("flight");
  }, [filters]);

  useEffect(() => {
    setItems([]);
    if (activeTab === "airbnb") {
      setFilters({ rating: 3, offset: 0, limit: 10, close_to_airport: "", search_start_date: "", search_end_date: ""});
    } else {
      setFilters({
        starting_airport: "",
        destination_airport: "",
        date: "",
        offset: 0,
        limit: 10,
      });
    }
  }, [activeTab]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      offset: 0, // Reset offset to 0 when filters change
    });
  };

  const handlePageChange = (direction) => {
    // console.log('idhar', direction)
    if (direction === "next") {
      // console.log('idhar', direction)
      setFilters((prevFilters) => ({
        ...prevFilters, // Keep the previous state values
        offset: prevFilters.offset + 1, // Increment the offset by 1
      }));
    }
    if (direction === "prev" && filters.offset > 0) {
      // console.log('idhar', direction)
      setFilters((prevFilters) => ({
        ...prevFilters, // Keep the previous state values
        offset: prevFilters.offset - 1, // Increment the offset by 1
      }));
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Add Segment to Plan</h2>
        <button
          onClick={() => navigate(`/plans/${id}`)}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Back to Plan
        </button>
      </div>

      <div className="mb-4 flex">
        <button
          className={`px-4 py-2 mr-2 rounded ${
            activeTab === "airbnb" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("airbnb")}
        >
          Accommodation
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === "flight" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("flight")}
        >
          Flights
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-1 bg-white p-4 rounded shadow max-h-[600px]">
          <h3 className="text-xl font-semibold mb-2">Filters</h3>
          <div>
            {activeTab === "airbnb" && (
              <div className="space-y-3">
                <div>
                  <label className="block mb-2 font-medium">Price Order</label>
                  <select
                    name="price_order"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    onChange={handleFilterChange}
                    defaultValue=""
                  >
                    <option value="" disabled hidden>
                      Select Order
                    </option>
                    <option value="asc">Lower to Higher</option>
                    <option value="desc">Higher to Lower</option>
                  </select>
                </div>

                {/* Close to Airport */}
                <div>
                  <label className="block mb-2 font-medium">
                    Close to Airport <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="close_to_airport"
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                    onChange={handleFilterChange}
                    defaultValue=""
                  >
                    <option value="" disabled hidden>
                      Select Airport
                    </option>
                    <option value="CLT">CLT</option>
                    <option value="DEN">DEN</option>
                    <option value="DFW">DFW</option>
                    <option value="EWR">EWR</option>
                    <option value="JFK">JFK</option>
                    <option value="LAX">LAX</option>
                    <option value="MIA">MIA</option>
                    <option value="ORD">ORD</option>
                    <option value="SFO">SFO</option>
                  </select>
                </div>

                {/* From Date */}
                <div>
                  <label className="block mb-2 font-medium">
                    From Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="search_start_date"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    max={lastSixMonthsEnd}
                    min={lastSixMonthsStart}
                    onChange={handleFilterChange}
                  />
                </div>

                {/* To Date */}
                <div>
                  <label className="block mb-2 font-medium">
                    To Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="search_end_date"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    min={filters.search_start_date || lastSixMonthsStart} // From Date selected or start of July 2022
                    max={lastSixMonthsEnd} // End of 2022
                    onChange={handleFilterChange}
                  />
                </div>

                {/* Number of People */}
                <div>
                  <label className="block mb-2 font-medium">
                    Number of People
                  </label>
                  <input
                    name="accomodates"
                    placeholder="Enter number of people"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    onChange={handleFilterChange}
                  />
                </div>

                {/* Minimum Rating */}
                <div>
                  <label className="block mb-2 font-medium">
                    Minimum Rating
                  </label>
                  <div className="relative group">
                    {isRatingActive && (
                      <div
                        className="absolute transform -translate-x-1/2 -translate-y-6 bg-gray-200 text-black text-xs font-bold px-2 py-1 rounded shadow group-hover:block"
                        style={{
                          left: `${(filters.rating - 1) * 25}%`,
                        }}
                      >
                        {filters.rating}
                      </div>
                    )}
                    <input
                      type="range"
                      name="rating"
                      min="1"
                      max="5"
                      step="0.1"
                      className="w-full cursor-pointer"
                      value={filters.rating}
                      onChange={(e) => {
                        handleFilterChange(e);
                        setIsRatingActive(true);
                      }}
                      onMouseEnter={() => setIsRatingActive(true)}
                      onMouseLeave={() => setIsRatingActive(false)}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>1</span>
                      <span>5</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "flight" && (
              <div className="space-y-3">
                <div>
                  <label className="block mb-2 font-medium">Price Order</label>
                  <select
                    name="price_order"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    onChange={handleFilterChange}
                    defaultValue=""
                  >
                    <option value="" disabled hidden>
                      Select Order
                    </option>
                    <option value="asc">Lower to Higher</option>
                    <option value="desc">Higher to Lower</option>
                  </select>
                </div>

                {/* Starting Airport */}
                <div>
                  <label className="block mb-2 font-medium">From <span className="text-red-500">*</span></label>
                  <select
                    name="starting_airport"
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                    onChange={handleFilterChange}
                    defaultValue=""
                  >
                    <option value="" disabled hidden>
                      Select From
                    </option>
                    <option value="CLT">CLT</option>
                    <option value="DEN">DEN</option>
                    <option value="DFW">DFW</option>
                    <option value="EWR">EWR</option>
                    <option value="JFK">JFK</option>
                    <option value="LAX">LAX</option>
                    <option value="MIA">MIA</option>
                    <option value="ORD">ORD</option>
                    <option value="SFO">SFO</option>
                  </select>
                </div>

                {/* Destination Airport */}
                <div>
                  <label className="block mb-2 font-medium">To <span className="text-red-500">*</span></label>
                  <select
                    name="destination_airport"
                    className="w-full border border-gray-300 rounded px-3 py-2 bg-white"
                    onChange={handleFilterChange}
                    defaultValue=""
                  >
                    <option value="" disabled hidden>
                      Select To
                    </option>
                    <option value="CLT">CLT</option>
                    <option value="DEN">DEN</option>
                    <option value="DFW">DFW</option>
                    <option value="EWR">EWR</option>
                    <option value="JFK">JFK</option>
                    <option value="LAX">LAX</option>
                    <option value="MIA">MIA</option>
                    <option value="ORD">ORD</option>
                    <option value="SFO">SFO</option>
                  </select>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="block mb-2 font-medium">Date <span className="text-red-500">*</span></label>
                  <input
                    type="date"
                    name="date"
                    max={lastSixMonthsEnd}
                    min={lastSixMonthsStart}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    onChange={handleFilterChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        {/* {activeTab=='airbnb' &&  */}
        <div className="col-span-2 bg-white p-4 rounded shadow  max-h-[600px] overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={() => handlePageChange("prev")}
              disabled={filters.offset <= 0}
              className="bg-blue-500 px-4 py-2 rounded text-white disabled:bg-gray-300"
            >
              Previous
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {activeTab == "airbnb"
              ? items.map((item) => (
                  <div key={item.airbnb_id} className="bg-gray-100 p-4 rounded">
                    <h3 className="font-semibold text-xl mb-2">
                      <a
                        href={item.listing_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.name}
                      </a>
                    </h3>
                    <p className="text-gray-600 mb-4">{item.listing_url}</p>

                    {/* Property details in horizontal layout */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="flex justify-between">
                        <strong>Bedrooms:</strong>
                        <span>{item.bedrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <strong>Bathrooms:</strong>
                        <span>{item.bathrooms}</span>
                      </div>
                      <div className="flex justify-between">
                        <strong>Beds:</strong>
                        <span>{item.beds}</span>
                      </div>
                      <div className="flex justify-between">
                        <strong>Accommodates:</strong>
                        <span>{item.accommodates}</span>
                      </div>
                      <div className="flex justify-between">
                        <strong>Price:</strong>
                        <span>${item.price}</span>
                      </div>
                    </div>

                    {/* Display Airbnb image */}
                    <img
                      src={item.picture_url}
                      alt={item.name}
                      className="w-full h-48 object-cover rounded mb-4"
                    />

                    {/* Rating and Reviews */}
                    <div className="flex items-center text-gray-700 mb-4">
                      <span className="font-semibold">Rating:</span>
                      <span className="ml-2">
                        {item.review_scores_rating} / 5
                      </span>
                      <span className="ml-2 text-gray-500">
                        ({item.number_of_reviews} reviews)
                      </span>
                    </div>

                    {/* Add to plan button */}
                    <button className="bg-green-500 text-white py-2 px-4 rounded mt-2" onClick={()=>addToPlan(item.airbnb_id)}>
                      Add to Plan
                    </button>
                  </div>
                ))
              : items.map((flight) => (
                <div
                key={flight.flight_id}
                className="bg-gray-100 p-4 rounded"
              >
                {/* Flight details */}
                <h3 className="font-semibold text-xl mb-2">
                  {flight.starting_airport} to {flight.destination_airport}
                </h3>
              
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex justify-between">
                    <strong>Departure:</strong>
                    <span>{flight.departure_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <strong>Arrival:</strong>
                    <span>{flight.arrival_time}</span>
                  </div>
                  <div className="flex justify-between">
                    <strong>Duration:</strong>
                    <span>{flight.travel_duration} min</span>
                  </div>
                  <div className="flex justify-between">
                    <strong>Total Fare:</strong>
                    <span>${flight.total_fare}</span>
                  </div>
                </div>
              
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex justify-between">
                    <strong>Airline:</strong>
                    <span>{flight.airline_id}</span>
                  </div>
                  <div className="flex justify-between">
                    <strong>Equipment:</strong>
                    <span>{flight.equipment_description}</span>
                  </div>
                  <div className="flex justify-between">
                    <strong>Basic Economy:</strong>
                    <span>{flight.is_basic_economy ? 'Yes' : 'No'}</span>
                  </div>
                </div>
              
                {/* Add to plan button */}
                <button
                  className="bg-green-500 text-white py-2 px-4 rounded mt-2"
                  onClick={() => addToPlan(flight.flight_id)}
                >
                  Add to Plan
                </button>
              </div>
              
                ))}
          </div>
          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => handlePageChange("next")}
              disabled={items.length < 10}
              className="bg-blue-500 px-4 py-2 rounded text-white disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
