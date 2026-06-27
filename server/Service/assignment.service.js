import Assignment_Model from "../Model/assignment.model.js";

// Create Assignment
export const createAssignmentService = async (data) => {
  return await Assignment_Model.create(data);
};

// Get all assignments
export const getAllAssignmentService = async () => {
  return await Assignment_Model.find().sort({ createdAt: -1 });
};

// Get by ID
export const getAssignmentByIdService = async (id) => {
  return await Assignment_Model.findById(id);
};

// Get total assignments count
export const getTotalAssignment = async () => {
  return await Assignment_Model.countDocuments();
};
