import { dashboardService } from '../Service/dashboard.service.js';

export const dashboardStat = async (req, res, next) => {
    try {
        // The JWT payload is { id, email } (see utils/GenerateJWT.js), so the user
        // id lives on `id`, not `_id`. Reading `_id` sent `undefined` to the
        // service and every dashboard call failed with "User not found".
        const userId = req.user?.id;
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
