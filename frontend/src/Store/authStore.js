import { create } from "zustand";
import axios from "axios";
import { errorMessage, successMessage } from "../Utils/HandleToast";

const API_URL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true; // Include cookies automatically with every request

export const useAuthStore = create((set) => ({
  isLoading: false,

  signup: async (formData) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(`${API_URL}/auth/signup`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res.data);
      successMessage(res.data.message);

      set({ isLoading: false });
    } catch (error) {
      console.error(error);
      errorMessage(error.message);
      set({ isLoading: false });
    }
  },
}));
