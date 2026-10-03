import Project from '../Model/project.model.js'

// Create project
export const createProjectService = async (data) => {
    return await Project.create(data)
}

// Get all projects, newest first
export const getAllProjectService = async () => {
    return await Project.find().sort({ createdAt: -1 })
}

// Get by ID
export const getProjectByIdService = async (id) => {
    return await Project.findById(id)
}

// Get total projects count
export const getTotalProjectService = async () => {
    return await Project.countDocuments()
}
