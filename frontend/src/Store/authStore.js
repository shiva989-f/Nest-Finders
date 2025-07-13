import { create } from "zustand";
import axios from "axios";
import { errorMessage, successMessage } from "../Utils/HandleToast";

const API_URL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true; // Include cookies automatically with every request

export const useAuthStore = create((set) => ({
  isLoading: false,
  isCheckingAuth: true,
  isAuthenticated: false,
  user: null,

  signup: async (formData) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(`${API_URL}/auth/signup`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      successMessage(res.data.message);

      set({ isLoading: false, user: res.data.user });
      return res.data; // Return the response data for further use
    } catch (error) {
      errorMessage(error.response.data.message);
      set({ isLoading: false });
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(`${API_URL}/auth/verify-email`, code);
      successMessage(res.data.message);

      set({ isLoading: false, user: res.data.user, isAuthenticated: true });
      return res.data; // Return the response data for further use
    } catch (error) {
      errorMessage(error.response.data.message);
      set({ isLoading: false });
    }
  },

  login: async (userData) => {
    set({ isLoading: true });
    try {
      const res = await axios.post(`${API_URL}/auth/login`, userData);
      successMessage(res.data.message);
      set({ isLoading: false, user: res.data.user, isAuthenticated: true });
      return res.data;
    } catch (error) {
      errorMessage(error.response.data.message);
      set({ isLoading: false });
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await axios.get(`${API_URL}/auth/check-auth`);
      set({
        isCheckingAuth: false,
        user: res.data.user,
        isAuthenticated: true,
      });
    } catch (error) {
      set({ isCheckingAuth: false, isAuthenticated: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, {
        email,
      });

      successMessage(response.data.message);
      set({ isLoading: false });
    } catch (error) {
      errorMessage(error.response.data.message);
      set({ isLoading: false });
    }
  },

  resetPassword: async (resetToken, password) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(`${API_URL}/auth/reset-password`, {
        resetToken,
        password,
      });
      set({ isLoading: false });
      successMessage("Password changed successfully!");
    } catch (error) {
      errorMessage(error.response.data.message);
      set({ isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const resposne = await axios.get(`${API_URL}/auth/logout`);
      set({ isLoading: false });
      successMessage("Logged out");
      return resposne;
    } catch (error) {
      set({ isLoading: false });
      errorMessage("Failed to logged out");
    }
  },
}));
