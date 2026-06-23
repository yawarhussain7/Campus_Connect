import api from "./axios";

export const SignInUser = async (userData) => {
  const response = await api.post("/auth/signIn", userData);
  return response;
};


export const SignUpUser = async (userData)=>{
    const response = await api.post('/auth/signUp',userData)
    return response
}
