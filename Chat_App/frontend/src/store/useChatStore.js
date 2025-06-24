import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get) => ({
  messages: [],
  users: [],
  selectedUser:
    typeof window !== "undefined" &&
    JSON.parse(localStorage.getItem("selectedUser")) || null, // Hydrate from localStorage
  isUsersLoading: false,
  isMessagesLoading: false,

  // Get Users
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.message || "Failed to fetch users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Get Messages for a Specific User
  getMessages: async (userId) => {
    if (!userId) return;
    set({ isMessagesLoading: true, messages: [] });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error(
        error.response?.data?.message || "Failed to fetch messages"
      );
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  // Send Message to Selected User
  sendMessage: async (messageData) => {
    const { selectedUser, messages } = useChatStore.getState();
    if (!selectedUser?._id) {
      toast.error("No user selected");
      return;
    }

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );
      set({ messages: [...messages, res.data] });
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error(error.response?.data?.message || "Failed to send message");
    }
  },

  subscibeToMessages:()=>{
    const {selectedUser}=get()
    if(!selectedUser)return;

    const socket=useAuthStore.getState().socket;
    
    socket.on("newMessage",(newMessage)=>{
      const isMessageSendFromSelectedUser=newMessage.senderId===selectedUser._id;
      if(!isMessageSendFromSelectedUser)return;
      set({
        messages:[...get().messages,newMessage],
      });
    });
  },
  

  unsubscibeFromMessages:()=>{
     const socket=useAuthStore.getState().socket;
     socket.off("newMessage");
  },
  // Set Selected User and Persist to LocalStorage
  setSelectedUser: (selectedUser) => {
    localStorage.setItem("selectedUser", JSON.stringify(selectedUser));
    set({ selectedUser, isMessagesLoading: true, messages: [] });
  },
}));
