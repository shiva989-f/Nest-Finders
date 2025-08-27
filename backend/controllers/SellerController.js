import { deleteImage, uploadFile } from "../Cloudinary/CloudinaryConfig.js";
import { Property } from "../models/PropertyModel.js";
import { User } from "../models/UsersModel.js";
import fs from "fs";

// For adding new properties by seller - http://localhost:3000/api/seller/add-property
export const addProperty = async (req, res) => {
  const user = req.user;
  if (user.userRole !== "seller")
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized user, Access denied!" });

  try {
    // Upload each image to Cloudinary
    const uploadedImages = [];

    for (const file of req.files) {
      const result = await uploadFile(file.path);
      uploadedImages.push({
        imageUrl: result.secure_url,
        public_id: result.public_id,
      });
      fs.unlinkSync(file.path); // Delete local file after upload
    }

    const seller = await User.findById(user.userId);
    if (!seller) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized user, Access denied!" });
    }

    // Create property with image URLs
    const property = await Property.create({
      ...req.body,
      images: uploadedImages,
    });
    property.listedBy = seller.email;
    await property.save();
    res
      .status(201)
      .json({ success: true, message: "Property listed successfully!" });
  } catch (error) {
    if (error instanceof multer.MulterError) {
      return res
        .status(400)
        .json({ message: "File size limit exceeded", success: false });
    }
    res
      .status(500)
      .json({ success: false, error, message: "Something went wrong!" });
  }
};

// For showing all properties listed by seller - http://localhost:3000/api/seller/show-all-properties
export const showAllProperties = async (req, res) => {
  const user = req.user;

  if (user.userRole !== "seller")
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized user, Access denied!" });

  try {
    const userInfo = await User.findById(user.userId);
    if (!userInfo) return res.status(404).json("User not found, Please Login!");

    const properties = await Property.find({ listedBy: userInfo.email });
    res
      .status(200)
      .json({ success: true, message: "All properties fetched!", properties });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};

// For showing property listed by seller - http://localhost:3000/api/seller/get-property/:propertyId
export const getProperty = async (req, res) => {
  const user = req.user;

  if (user.userRole !== "seller")
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
    console.log(error);

    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};

// For editing property listed by seller - http://localhost:3000/api/seller/edit-property/68527dc33c71ce6983460bc8
export const editProperty = async (req, res) => {
  const user = req.user;
  if (user.userRole !== "seller")
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
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found!" });
    }
    // If property found, delete all images
    for (const image of property.images) {
      await deleteImage(image.public_id); // Delete each image from Cloudinary
    }

    // After deleting images upload new images
    // Upload each image to Cloudinary
    const uploadedImages = [];

    for (const file of req.files) {
      const result = await uploadFile(file.path);
      uploadedImages.push({
        imageUrl: result.secure_url,
        public_id: result.public_id,
      });
      fs.unlinkSync(file.path); // Delete local file after upload
    }

    await property.updateOne({ ...req.body, images: uploadedImages });

    res
      .status(200)
      .json({ success: true, message: "Property details edited!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};

// For deleting property listed by seller - http://localhost:3000/api/seller/delete-property/68527dc33c71ce6983460bc8
export const deleteProperty = async (req, res) => {
  const user = req.user;
  if (user.userRole !== "seller")
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
    if (!property) {
      return res
        .status(404)
        .json({ success: false, message: "Property not found!" });
    }
    if (property.images[0]) {
      for (const image of property.images) {
        await deleteImage(image.public_id); // Delete each image from Cloudinary
      }
    }
    await property.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Property deleted from the list!" });
  } catch (error) {
    console.log(error);

    res.status(500).json({ success: false, message: "Something went wrong!" });
  }
};
