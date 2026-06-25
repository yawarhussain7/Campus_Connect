import Assignment_Model from '../Model/assignment.model.js'
//**<<<<<<<<<<<<<======================== Create assignment ============================>>>>>>>>>>>>>>>>>>>>> */
export const assignmentService = async (assignmentData) => {
    try {
        const { title, description, subject, instructor, department, semester, fileUrl } = assignmentData
        const assignment = await Assignment_Model.create({
            title,
            description,
            subject,
            instructor,
            department,
            semester,
            fileUrl
        });
        return assignment;
    } catch (error) {
        console.log(error)
        throw new Error(error.message)
    }
};
//**<<<<<<<<<<<<<======================== get total number assignment ============================>>>>>>>>>>>>>>>>>>>>> */
export const getTotalAssignment = async()=>{
    try{
        const totalassignments = await Assignment_Model.countDocuments()
        return totalassignments;
    }catch(error){
        throw new Error(error.message)
    }
}