import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
const BASE_URL="https://chat-app-9qil.onrender.com";
export const useAuthStore=create((set,get)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers:[],
    socket:null,
    checkAuth:async()=>{
        try{
            const res=await axiosInstance.get("/auth/check");
            set({authUser:res.data});
            get().connectSocket()
        }catch(error){
            console.log("Error in checkAuth :",error);
            set({authUser:null});
        }finally{
            set({isCheckingAuth:false});
        }
        
    },


    login: async (data) => {
        console.log("Login Payload :", JSON.stringify(data, null, 2)); 
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", data);
            console.log("Login Response:", res.data); 
            set({ authUser: res.data });
            toast.success("Logged in successfully");
            get().connectSocket();
        } catch (error) {
            console.error("Login failed:", error);
            console.error("Error Details:", error.response?.data || error.message); 
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            set({ isLoggingIn: false });
        }
    },
    

    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", data);
            set({ authUser: res.data.user });
            toast.success("Account created successfully");
            get().connectSocket();
        } catch (error) {
            console.error("Signup failed:", error);
            toast.error(error.response?.data?.message || "Signup failed");
        } finally {
            set({ isSigningUp: false });
        }
    },
    

    logout:async()=>{
        try{
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("Logged out succeddfully");
            get().disconnectSocket()
        }catch(error){
            toast.error(error.response.data.message);
        }
    },

    updateProfile:async(data)=>{
        set({isUpdatingProfile:true});
        try{
            const res=await axiosInstance.put("/auth/update-profile",data);
            set({authUser:res.data});
            toast.success("Profile updated successfully");
        }catch(error){
            console.log("Error in update profile",error);
            toast.error(error.response.data.message);
        }finally{
            set({isUpdatingProfile:false});
        }
    },
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;
        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });
    
        socket.on("connect", () => {
            socket.emit("join", authUser._id); // Notify server about the user
        });
    
        set({ socket });
    
        socket.on("getOnlineUsers", (userIds) => {
            set({ onlineUsers: userIds });
        });
    
        socket.on("newMessage", (newMessage) => {
            // Handle incoming messages here
            const currentMessages = get().messages || [];
            set({ messages: [...currentMessages, newMessage] });
        });
    },
    
}));