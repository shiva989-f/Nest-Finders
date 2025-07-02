import mongoose from "mongoose";
import { Property } from "../models/PropertyModel.js";
import { User } from "../models/UsersModel.js";

// Show all properties to user - http://localhost:3000/api/user/show-properties
export const showProperties = async (req, res) => {
  const user = req.user;
  if (!user)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized user, Access denied!" });
  try {
    const properties = await Property.find();
    if (!properties)
      return res
        .status(404)
        .json({ success: false, message: "No property is listed!" });

    res.status(200).json({
      success: true,
      message: "All properties data is fetched!",
      properties,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};

// Increase property views count - http://localhost:3000/api/user/increase-property-views/685281497c4c937f60dad9a8
export const increaseViewsCount = async (req, res) => {
  const user = req.user;

  // 1. User Authentication
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user, access denied!",
    });
  }

  try {
    const { propertyId } = req.params;

    // 2. Validate Property ID
    if (!propertyId || !mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID!",
      });
    }

    // 3. Increment view count
    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      { $inc: { views: 1 } },
      { new: true } // Return the updated document
    );

    // 4. Handle if property not found
    if (!updatedProperty) {
      return res.status(404).json({
        success: false,
        message: "Property not found!",
      });
    }

    // 5. Respond with updated property
    res.status(200).json({
      success: true,
      message: "View count increased successfully!",
      property: updatedProperty,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
    });
  }
};

// Add property into user favourites array and increase favourite count in property - http://localhost:3000/api/user/add-to-favourties/685281497c4c937f60dad9a8
export const addToFavourites = async (req, res) => {
  const user = req.user;

  if (!user)
    return res.status(401).json({
      success: false,
      message: "Unauthorized user, Access denied!",
    });

  try {
    const propertyId = req.params.propertyId;

    // Validate property ID
    if (!mongoose.Types.ObjectId.isValid(propertyId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid property ID!",
      });
    }

    // Fetch user data
    const userInfo = await User.findById(user.userId);

    if (!userInfo) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Check if property is already in favourites
    const alreadyFavourite = userInfo.favourites.includes(propertyId);

    if (alreadyFavourite) {
      return res.status(400).json({
        success: false,
        message: "Property is already in favourites!",
      });
    }

    // Check if property exists before pushing
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found!",
      });
    }

    // Add to favourites and increment count
    userInfo.favourites.push(propertyId);
    await userInfo.save();

    property.favourites += 1;
    await property.save();

    res.status(200).json({
      success: true,
      message: "Property added to favourites!",
      userInfo,
      property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};

// Show all properties from user favourites array - http://localhost:3000/api/user/show-all-favourties/
export const showAllFavourites = async (req, res) => {
  const user = req.user;
  if (!user)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized user, Access denied!" });

  try {
    const userInfo = await User.findById(user.userId);
    if (!userInfo)
      return res
        .status(404)
        .json({ success: false, message: "User not found, Please login!" });

    const favProperties = await Property.find({_id: {$in: userInfo.favourites}})
    res.status(200).json({success: true, message: "Fetched all properties from favourites!", favProperties})
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
    });
  }
};
