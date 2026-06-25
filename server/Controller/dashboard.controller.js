import { dashboardService } from '../Service/dashboard.service.js';

export const dashboardStat = async (req, res, next) => {
    try {
        const userId = req.user?._id;
        const data = await dashboardService(userId);

        return res.status(200).json({
            success: true,
            message: 'Dashboard data fetched successfully',
            data
        });

    } catch (error) {
        next(error)
    }
};
