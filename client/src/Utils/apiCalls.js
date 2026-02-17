import axios from "axios";
// Auth Api Calls
export const register = async (email, password, name) => {
    return await axios.post("/api/auth/register", { email, password, name });
};  
export const login = async (email, password) => {
    return await axios.post("/api/auth/login", { email, password });
}