import { getAllTeacher, getTeacherById, scrapeAndSaveTeachers } from '../Service/teacher.service.js'

export const getAllTeacherController = async (req, res) => {
    try {
        const teachers = await getAllTeacher()

        res.status(200).json({
            message: 'Teacher Data get successfully',
            success: true,
            count: teachers.length,
            data: teachers
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Failed to fetch teacher data'
        })
    }
}


export const getTeacherByIdController = async (req, res) => {
    try {
        const id = req.params.id

        const teacher = await getTeacherById(id);

        if (!teacher) {
            return res.status(404).json({
                message: 'Teacher not found ',
                success: false,
            })
        }

        res.status(200).json({
            message: 'teacher get successfully',
            data: teacher
        })
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to get teacher",
        });
    }
}

export const scrapeComsatsController  = async(req,res)=>{
    try{
        const result = await scrapeAndSaveTeachers()

        res.status(200).json({
            success:true,
            message:"COMSATS teachers scraped successfully",
            data:result
        })
    }catch(error){
 console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
    }
}
