import { getTotalAssignment } from './assignment.service.js';

export const dashboardService = async () => {
    try {
        const totalAssignments = await getTotalAssignment();
        return {
            totalAssignments
        };

    } catch (error) {
        throw new Error(error.message);
    }
};