import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function UserPlans() {
  const [plans, setPlans] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlan, setNewPlan] = useState({ name: '', description: '' });
  const [editMode, setEditMode] = useState(false); // Track if we're in edit mode
  const [currentPlanId, setCurrentPlanId] = useState(null); // Track the plan to be edited
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch data when the component mounts
  useEffect(() => {
    fetch(`https://travel-planner-440113.uc.r.appspot.com/users/${id}/plans`)
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Plans fetched successfully') {
          setPlans(data.data); // Store the fetched plans in state
        }
      })
      .catch((error) => {
        console.error('Error fetching plans:', error);
      });
  }, [id]);

  const openModal = (plan = null) => {
    if (plan) {
      setEditMode(true);
      setCurrentPlanId(plan.plan_id);
      setNewPlan({
        name: plan.plan_name,
        description: plan.plan_description,
      });
    } else {
      setEditMode(false);
      setNewPlan({ name: '', description: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setNewPlan({ name: '', description: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPlan((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeletePlan = async (planId, event) => {
    event.stopPropagation(); // Prevent navigation when clicking delete
    
    try {
      const response = await fetch(`https://travel-planner-440113.uc.r.appspot.com/plans/${planId}`, {
        method: 'DELETE',
      });
      
      if (response.status === 204) {
        // Remove the deleted plan from state
        setPlans(plans.filter(plan => plan.plan_id !== planId));
      } else {
        throw new Error('Failed to delete plan');
      }
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const handleCreatePlan = () => {
    const payload = {
      plan_name: newPlan.name,
      user_id: Number(id),
      plan_description: newPlan.description,
    };
  
    fetch('https://travel-planner-440113.uc.r.appspot.com/plans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Plan created successfully') {
          const newPlanData = {
            plan_id: data.data.plan_id, // Use the ID returned by the API
            plan_name: newPlan.name,
            plan_description: newPlan.description,
          };
  
          setPlans((prevPlans) => [...prevPlans, newPlanData]);
          closeModal();
          console.log('New Plan Created:', newPlanData);
        } else {
          console.error('Error creating plan:', data);
        }
      })
      .catch((error) => {
        console.error('API Error:', error);
      });
  };

  const handleUpdatePlan = () => {
    const payload = {
      plan_name: newPlan.name,
      plan_description: newPlan.description,
    };

    fetch(`https://travel-planner-440113.uc.r.appspot.com/plans/${currentPlanId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === 'Plan updated successfully') {
          setPlans((prevPlans) =>
            prevPlans.map((plan) =>
              plan.plan_id === currentPlanId
                ? { ...plan, plan_name: newPlan.name, plan_description: newPlan.description }
                : plan
            )
          );
          closeModal();
          console.log('Plan Updated:', data);
        } else {
          console.error('Error updating plan:', data);
        }
      })
      .catch((error) => {
        console.error('API Error:', error);
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Travel Plans</h2>
      <div className="grid gap-4">
        {plans.map((plan) => (
          <div
            key={plan.plan_id}
            className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
            onClick={() => navigate(`/plans/${plan.plan_id}`)}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold">{plan.plan_name}</h3>
                <p className="text-gray-600">{plan.plan_description}</p>
              </div>
              <div>
                <button
                  onClick={(e) => handleDeletePlan(plan.plan_id, e)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 mr-2"
                >
                  Remove
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal(plan);
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm hover:bg-yellow-600"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        ))}
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => openModal()}
        >
          Create New Plan
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
            <button
              className="absolute top-1 right-3 text-gray-1000 hover:text-gray-800 text-2xl font-bold p-2"
              onClick={closeModal}
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4">
              {editMode ? 'Edit Plan' : 'Create a New Plan'}
            </h3>
            <form className="space-y-4">
              <div>
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="name"
                >
                  Plan Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={newPlan.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter plan name"
                />
              </div>
              <div>
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={newPlan.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter plan description"
                />
              </div>
              <button
                type="button"
                onClick={editMode ? handleUpdatePlan : handleCreatePlan}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                {editMode ? 'Update Plan' : 'Create Plan'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
