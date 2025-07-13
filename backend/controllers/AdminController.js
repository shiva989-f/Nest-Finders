import { deleteImage } from "../Cloudinary/CloudinaryConfig.js";
import { Property } from "../models/PropertyModel.js";
import { User } from "../models/UsersModel.js";

// Show all users http://localhost:3000/api/admin/show-all-users
export const showAllUsers = async (req, res) => {
  const user = req.user;
  if (user.userRole !== "admin")
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized user, Access denied!" });

  try {
    const users = await User.find({
      _id: { $ne: user.userId }, // Exclude self
      role: { $in: ["buyer", "seller"] }, // Includes only buyer and seller
    }).select("-password");
    if (!users)
      return res
        .status(404)
        .json({ success: false, message: "Users not found!" });

    res
      .status(200)
      .json({ success: true, users, message: "All users founded!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};

// Delete user http://localhost:3000/api/admin/delete-user/684e774d8f7ce87924603fe5
export const deleteUser = async (req, res) => {
  const user = req.user;
  if (user.userRole !== "admin")
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized user, Access denied!" });

  try {
    // User id of the user to delete
    const userId = req.params.userId;
    if (!userId)
      return res
        .status(404)
        .json({ success: false, message: "User not found, Invalid User ID!" });

    const user = await User.findById(userId); // Find the user and delete
    if (!user) {
      return res
        .status(404)
        .json({ success: false, messge: "User not found!" });
    }
    await deleteImage(user.profilePicId);
    await user.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "User deleted succesfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};

// Property Management APIs

// Show all properties http://localhost:3000/api/admin/show-all-properties
export const showAllProperties = async (req, res) => {
  const user = req.user;

  if (user.userRole !== "admin")
    return res.status(401).json("Unauthorized user, Access denied!");

  try {
    const properties = await Property.find();
    res
      .status(200)
      .json({ success: true, message: "All properties fetched!", properties });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};

// Delete user http://localhost:3000/api/admin/delete-property/684e774d8f7ce87924603fe5
export const deleteProperty = async (req, res) => {
  const user = req.user;
  if (user.userRole !== "admin")
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized user, Access denied!" });

  try {
    const propertyId = req.params.propertyId;
    if (!propertyId)
      return res
        .status(404)
        .json({ success: false, message: "No property id found" });

    const property = await Property.findById(propertyId);
    if (!property)
      return res
        .status(404)
        .json({ success: false, message: "Property Not found!" });

    // Delete property images
    for (const image of property.images) {
      await deleteImage(image.public_id);
    }

    await property.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Property deleted from the list!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};
