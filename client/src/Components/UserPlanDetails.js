import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// Modal Component
const SegmentDetailModal = ({ segment, onClose }) => {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSegmentDetails = async () => {
      try {
        let url;
        if (segment.segment_type === 'airbnb') {
          url = `https://travel-planner-440113.uc.r.appspot.com/airbnbs/${segment.segment_id}`;
        } else if (segment.segment_type === 'flight') {
          url = `https://travel-planner-440113.uc.r.appspot.com/flights/${segment.segment_id}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        setDetails(data.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching segment details:', error);
        toast.error('Failed to load segment details');
        setIsLoading(false);
      }
    };

    fetchSegmentDetails();
  }, [segment]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg">
          <p>Loading details...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white p-6 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {segment.segment_type === 'airbnb' && details && (
          <div>
            <h2 className="text-2xl font-bold mb-4">{details.name}</h2>
            <img 
              src={details.picture_url} 
              alt={details.name} 
              className="w-full h-48 object-contain rounded-lg mb-4"
            />
            <div className="space-y-2">
              <p><strong>Listing URL:</strong> <a href={details.listing_url} target="_blank" rel="noopener noreferrer" className="text-blue-600">View on Airbnb</a></p>
              <p><strong>Accommodates:</strong> {details.accommodates}</p>
              <p><strong>Bathrooms:</strong> {details.bathrooms}</p>
              <p><strong>Bedrooms:</strong> {details.bedrooms}</p>
              <p><strong>Beds:</strong> {details.beds || 'N/A'}</p>
              <p><strong>Price:</strong> ${details.price}</p>
              <p><strong>Close to Airport:</strong> {details.close_to_airport}</p>
              <p><strong>Host Name:</strong> {details.host_name}</p>
            </div>
          </div>
        )}
        
        {segment.segment_type === 'flight' && details && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Flight Details</h2>
            <div className="space-y-2">
              <p><strong>Date:</strong> {new Date(details.flight_date).toLocaleDateString()}</p>
              <p><strong>Route:</strong> {details.starting_airport} → {details.destination_airport}</p>
              <p><strong>Airline:</strong> {details.airline_name}</p>
              <p><strong>Departure Time:</strong> {details.departure_time}</p>
              <p><strong>Arrival Time:</strong> {details.arrival_time}</p>
              <p><strong>Travel Duration:</strong> {details.travel_duration} minutes</p>
              <p><strong>Total Fare:</strong> ${details.total_fare}</p>
            </div>
          </div>
        )}
        
        <button 
          onClick={onClose} 
          className="mt-4 w-full bg-gray-200 py-2 rounded-lg hover:bg-gray-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default function UserPlanDetails() {
  const [plan, setPlan] = useState(null);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchPlanDetails = () => {
    fetch(`https://travel-planner-440113.uc.r.appspot.com/plans/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Plan Details fetched successfully') {
          setPlan(data.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching plan details:', error);
        toast.error('Failed to load plan details');
      });
  };

  useEffect(() => {
    fetchPlanDetails();
  }, [id]);

  const handleDeleteSegment = async (segment, event) => {
    event.stopPropagation();
    
    try {
      const response = await fetch(`https://travel-planner-440113.uc.r.appspot.com/plans/${id}/segment/${segment.segment_id}`, {
        method: 'DELETE',
      });
      
      if (response.status === 204) {
        fetchPlanDetails();
        toast.success(`${segment.segment_type.charAt(0).toUpperCase() + segment.segment_type.slice(1)} deleted successfully`);
      } else {
        throw new Error('Failed to delete segment');
      }
    } catch (error) {
      console.error('Error deleting segment:', error);
      toast.error('Failed to delete segment');
    }
  };

  // Show a loading message while waiting for the plan details
  if (!plan) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Existing code remains the same */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{plan.plan_name}</h2>
        <button 
          onClick={() => navigate(`/users/${plan.user_id}/plans`)}
          className="bg-gray-200 px-4 py-2 rounded"
        >
          Back to Plans
        </button>
      </div>
      <p className="mb-4">{plan.plan_description}</p>

      <button 
        onClick={() => navigate(`/plans/${id}/segments`)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add Segment
      </button>

      <div className="space-y-4">
        {plan.segments.map(segment => (
          <div 
            key={segment.segment_id} 
            className="bg-white shadow rounded-lg p-4 cursor-pointer hover:shadow-lg"
            onClick={() => setSelectedSegment(segment)}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-lg">
                  {segment.segment_type === 'airbnb' 
                    ? `Airbnb` 
                    : `Flight: ${segment.starting_airport} To ${segment.destination_airport}`}
                </p>
                {/* Common Fields */}
                {segment.segment_type === 'airbnb' && (
                  <>
                    <p className="text-sm text-gray-600">
                      Dates: {segment.start_date} - {segment.end_date}
                    </p>
                    <p className="text-sm text-gray-600">
                      Close to Airport: {segment.close_to_airport}
                    </p>
                    <p className="text-sm text-gray-600">
                      Price: ${segment.price}
                    </p>
                  </>
                )}
                {segment.segment_type === 'flight' && (
                  <>
                    <p className="text-sm text-gray-600">
                      Flight Date: {segment.flight_date}
                    </p>
                    <p className="text-sm text-gray-600">
                      Total Fare: ${segment.total_fare}
                    </p>
                  </>
                )}
              </div>
              <div className="flex space-x-2">
                <button 
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                  onClick={(e) => handleDeleteSegment(segment, e)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Segment Details */}
      {selectedSegment && (
        <SegmentDetailModal 
          segment={selectedSegment} 
          onClose={() => setSelectedSegment(null)} 
        />
      )}
    </div>
  );
}