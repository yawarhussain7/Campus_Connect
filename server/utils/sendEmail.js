import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})


export const sendEmail = async({email,subject,html})=>{
    const mailOptions  = {
        from:process.env.EMAIL_USER,
        to:email,
        subject:subject,
        html:html
    }


    await transporter.sendMail(mailOptions)
}

