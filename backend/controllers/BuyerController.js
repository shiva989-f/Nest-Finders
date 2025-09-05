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

// Add property into user favorites array and increase favorite count in property - http://localhost:3000/api/user/add-to-favourties/685281497c4c937f60dad9a8
export const addToFavorites = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user, Access denied!",
    });
  }

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

    // Check if property exists before proceeding
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found!",
      });
    }

    // Add to favorites and increment count
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { $addToSet: { favorites: propertyId } }, // $addToSet prevents duplicates
      { new: true }
    );

    // Increment favorite count in property
    await Property.findByIdAndUpdate(propertyId, { $inc: { favorites: 1 } });

    // Find all the data from the id stored in favorites and return it
    const favProperties = await Property.find({
      _id: { $in: userInfo.favorites }, // Populate properties based on favorites
    });

    res.status(200).json({
      success: true,
      message: "Property added to favorites!",
      favProperties,
      action: "added",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating favorites!",
    });
  }
};

// Remove property into user favorites array and decrease favorite count in property - http://localhost:3000/api/user/remove-from-favourties/685281497c4c937f60dad9a8
export const removeFromFavorites = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user, Access denied!",
    });
  }

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

    // Check if property exists before proceeding
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found!",
      });
    }

    // Check if property is already in favorites
    const alreadyFavorite = userInfo.favorites.includes(propertyId);

    if (alreadyFavorite) {
      // Remove from favorites and decrement count
      const updatedUser = await User.findByIdAndUpdate(
        user.userId,
        { $pull: { favorites: propertyId } },
        { new: true }
      );

      // Decrement favorite count in property (with minimum 0 check)
      await Property.findByIdAndUpdate(
        propertyId,
        { $inc: { favorites: -1 } },
        { new: true }
      )
        .where("favorites")
        .gt(0); // prevents decrement if already 0

      // Find all the data from the id stored in favorites and return it
      const favProperties = await Property.find({
        _id: { $in: updatedUser.favorites }, // Populate properties based on favorites
      });

      return res.status(200).json({
        success: true,
        message: "Property removed from favorites!",
        favProperties,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Property is not in favorites!",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while updating favorites!",
    });
  }
};

// Show all properties from user favorites array - http://localhost:3000/api/user/show-all-favourties/
export const showAllFavorites = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized user, Access denied!" });
  }

  try {
    const userInfo = await User.findById(user.userId);

    if (!userInfo) {
      return res
        .status(404)
        .json({ success: false, message: "User not found, Please login!" });
    }

    // Handle case where user has no favorites
    if (!userInfo.favorites || userInfo.favorites.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No favorite properties found!",
        favProperties: [],
      });
    }

    // Find all the data from the id stored in favorites and return it
    const favProperties = await Property.find({
      _id: { $in: userInfo.favorites }, // Populate properties based on favorites
    });

    res.status(200).json({
      success: true,
      message: "Fetched all properties from favorites!",
      favProperties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching favorites!",
    });
  }
};

// For showing property listed by seller - http://localhost:3000/api/buyer/get-property/:propertyId
export const getProperty = async (req, res) => {
  const user = req.user;

  if (!user)
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized user, Access denied!" });

  try {
    const userInfo = await User.findById(user.userId);
    if (!userInfo) return res.status(404).json("User not found, Please Login!");

    const propertyId = req.params.propertyId;
    if (!propertyId) return res.status(404).json("Property ID not found!");

    const property = await Property.findById(propertyId);
    res
      .status(200)
      .json({ success: true, message: "All properties fetched!", property });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};
