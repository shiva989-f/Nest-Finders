import axios from "axios";
import { create } from "zustand";
import { errorMessage, successMessage } from "../Utils/HandleToast";

const API_URL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

export const useAdminStore = create((set) => ({
  isLoading: false,
  users: [],
  properties: [],

  fetchUsers: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/admin/show-all-users`);
      set({ isLoading: false, users: response.data.users });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  fetchProperties: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/admin/show-all-properties`);
      set({ isLoading: false, properties: response.data.properties });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  deleteUser: async (userId) => {
    set({ isLoading: true });
    console.log(userId);

    try {
      const response = await axios.get(
        `${API_URL}/admin/delete-user/${userId}`
      );
      set({ isLoading: false });
      successMessage("User deleted");
    } catch (error) {
      set({ isLoading: false });
      errorMessage("Failed to delete user");
    }
  },
}));
