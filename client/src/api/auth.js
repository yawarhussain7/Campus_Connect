import api from "./axios";

export const SignInUser = async (userData) => {
  const response = await api.post("/auth/signIn", userData);
  return response;
};


export const SignUpUser = async (userData)=>{
    const response = await api.post('/auth/signUp',userData)
    return response
}

// Requests a password-reset email for the given address.
export const ForgotPasswordUser = async (email)=>{
    const response = await api.post('/auth/forget-password',{ email })
    return response
}

// Completes the reset using the token from the email link.
export const ResetPasswordUser = async (token,newpassword)=>{
    const response = await api.post(`/auth/reset-password/${token}`,{ newpassword })
    return response
}

export const VerifyEmailUser = async (token)=>{
    const response = await api.get('/auth/verify-email',{ params:{ token } })
    return response
}

export const ResendVerificationEmail = async (email)=>{
    const response = await api.post('/auth/verify-email/resend',{ email })
    return response
}
