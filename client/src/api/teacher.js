import api from './axios';


export const ShowAllTeachers = () => {
    return api.get('/cui-teachers');
};
