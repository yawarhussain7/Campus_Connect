import { getTotalAssignment } from './assignment.service.js';
import {getUser} from './auth.service.js'
import {GetTotalPapaperService} from  './paper.service.js'
import User from '../Model/auth.model.js';

export const dashboardService = async (userId) => {
    try {
        const totalAssignments = await getTotalAssignment();
        const totalUsers = await User.countDocuments();
        const totalPaper = await GetTotalPapaperService()
        const user = await getUser(userId)
        return {
            totalAssignments,
            totalUsers,
            totalPaper,
            user
        };

    } catch (error) {
        throw new Error(error.message);
    }
};

