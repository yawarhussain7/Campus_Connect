import api from './axios';

/**
 * GET /cui-teachers -> the whole COMSATS faculty directory, sorted A→Z.
 * The axios interceptor already unwraps the body, so this resolves to
 * `{ message, success, count, data: [...] }`.
 */
export const ShowAllTeachers = () => {
    return api.get('/cui-teachers');
};
