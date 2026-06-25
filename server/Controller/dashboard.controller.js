import { dashboardService } from '../Service/dashboard.service.js';

export const dashboardStat = async (req, res, next) => {
    try {
        const data = await dashboardService();

        return res.status(200).json({
            success: true,
            message: 'Dashboard data fetched successfully',
            data
        });

    } catch (error) {
        next(error)
    }
};