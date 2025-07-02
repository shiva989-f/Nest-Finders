import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    location: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      pinCode: {  
        type: Number,
        required: true,
      },
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    images: [{ imageUrl: String, public_id: String }],
    description: {
      type: String,
      required: true,
    },
    plotArea: {
      area: Number, // 224
      areaIn: String, // sq.ft.
    },
    numberOfBedrooms: Number,
    numberOfBathrooms: Number,
    numberOfBalconies: Number,
    furnishedStatus: {
      type: String,
      enum: ["Furnished", "Semi-Furnished", "Unfurnished"],
      required: true,
    },
    totalFloors: {
      type: Number,
      required: true, // 0 means ground floor
    },
    propertyType: {
      type: String,
      enum: ["Apartment", "House", "Villa", "Plot", "Commercial"],
      required: true,
    },
    status: {
      type: String,
      enum: ["For Sale", "For Rent", "Under Construction"],
      required: true,
    },
    propertyOwner: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
        required: true,
      },
      contactNo: {
        type: String,
        match: [/^\d{10}$/, "Please enter a valid 10-digit number"],
        required: true,
      },
    },
    views: {
      type: Number,
      default: 0,
    },
    favourites: {
      type: Number,
      default: 0,
    },
    listedBy: String,
  },
  { timestamps: true }
);

export const Property = mongoose.model("Properties", PropertySchema);
