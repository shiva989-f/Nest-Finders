import { create } from "zustand";
import axios from "axios";
import { errorMessage, successMessage } from "../Utils/HandleToast";

const API_URL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

export const useSellerStore = create((set) => ({
  isLoading: false,
  properties: [],
  property: {},

  addProperty: async (formData) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(
        `${API_URL}/seller/add-property`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      set({ isLoading: false });
      if (response.data.success) {
        successMessage(response.data.message);
      } else {
        errorMessage(response.data.message);
      }
      return response;
    } catch (error) {
      errorMessage(" Unknown error occurred.");
      set({ isLoading: false });
    }
  },

  fetchListedProperties: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/seller/show-all-properties`);

      set({ isLoading: false, properties: response.data.properties });
    } catch (error) {
      errorMessage("Unknown error occurred.");
      set({ isLoading: false });
    }
  },

  getProperty: async (propertyId) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(
        `${API_URL}/seller/get-property/${propertyId}`
      );
      set({ isLoading: false, property: response.data.property });
    } catch (error) {
      errorMessage("Unknown error occurred.");
      set({ isLoading: false });
    }
  },

  editProperty: async (propertyId, formData) => {
    set({ isLoading: true });
    try {
      const response = await axios.post(
        `${API_URL}/seller/edit-property/${propertyId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      set({ isLoading: false });
      if (response.data.success) {
        successMessage(response.data.message);
      } else {
        errorMessage(response.data.message);
      }
      return response;
    } catch (error) {
      errorMessage("Unknown error occurred.");
      set({ isLoading: false });
    }
  },

  deleteProperty: async (propertyId) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(
        `${API_URL}/seller/delete-property/${propertyId}`
      );
      set({ isLoading: false });
      if (response.data.success) {
        successMessage(response.data.message);
      } else {
        errorMessage(response.data.message);
      }
      return response;
    } catch (error) {
      errorMessage("Unknown error occurred.");
      set({ isLoading: false });
    }
  },
}));
