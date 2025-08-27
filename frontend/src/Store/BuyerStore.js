import axios from "axios";
import { create } from "zustand";
import { errorMessage, successMessage } from "../Utils/HandleToast";

const API_URL = import.meta.env.VITE_API_BASE_URL;
axios.defaults.withCredentials = true;

export const useBuyerStore = create((set) => ({
  isLoading: false,
  properties: [],
  userFav: [],
  property: {},

  fetchAllProperties: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/buyer/show-properties`);
      set({ isLoading: false, properties: response.data.properties });
    } catch (error) {
      set({ isLoading: false });
      errorMessage("Something went wrong!");
    }
  },

  fetchProperty: async (propertyId) => {
    set({ isLoading: true });
    try {
      const response = await axios.get(
        `${API_URL}/buyer/get-property/${propertyId}`
      );
      set({ isLoading: false, property: response.data.property });
    } catch (error) {
      set({ isLoading: false });
      errorMessage("Something went wrong!");
    }
  },

  increasePropertyView: async (propertyId) => {
    set({ isLoading: true });
    try {
      if (!propertyId) {
        return errorMessage("Invalid api url!");
      }
      const response = await axios.get(
        `${API_URL}/buyer/increase-property-views/${propertyId}`
      );
      set({ isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  fetchUserFav: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${API_URL}/buyer/show-all-favorites`);
      set({ isLoading: false, userFav: response.data.favProperties });
    } catch (error) {
      errorMessage("Something went wrong!");
      set({ isLoading: false });
    }
  },

  addToFav: async (propertyId) => {
    try {
      const response = await axios.get(
        `${API_URL}/buyer/add-to-favorites/${propertyId}`
      );
      set({ userFav: response.data.favProperties });
      successMessage("Property added to favorites!");
    } catch (error) {
      errorMessage("Something went wrong!");
    }
  },

  removeFromFav: async (propertyId) => {
    try {
      const response = await axios.get(
        `${API_URL}/buyer/remove-from-favorites/${propertyId}`
      );
      set({ userFav: response.data.favProperties });
      successMessage("Property removed from favorites!");
    } catch (error) {
      errorMessage("Something went wrong!");
    }
  },
}));
