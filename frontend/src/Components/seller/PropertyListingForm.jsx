import { useState } from "react";
import {
  Home,
  MapPin,
  DollarSign,
  Camera,
  FileText,
  Bed,
  Bath,
  Users,
  ChevronRight,
  ChevronLeft,
  Upload,
  X,
  Plus,
} from "lucide-react";
import { useSellerStore } from "../../Store/SellerStore";

const PropertyListingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const initialState = {
    title: "",
    price: "",
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
      coordinates: {
        latitude: "",
        longitude: "",
      },
    },
    images: [],
    description: "",
    plotArea: {
      area: "",
      areaIn: "sq.ft.",
    },
    numberOfBedrooms: "",
    numberOfBathrooms: "",
    numberOfBalconies: "",
    furnishedStatus: "",
    totalFloors: "",
    propertyType: "",
    status: "",
    propertyOwner: {
      name: "",
      email: "",
      contactNo: "",
    },
  };
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    location: {
      address: "",
      city: "",
      state: "",
      country: "",
      pinCode: "",
      coordinates: {
        latitude: "",
        longitude: "",
      },
    },
    images: [],
    description: "",
    plotArea: {
      area: "",
      areaIn: "sq.ft.",
    },
    numberOfBedrooms: "",
    numberOfBathrooms: "",
    numberOfBalconies: "",
    furnishedStatus: "",
    totalFloors: "",
    propertyType: "",
    status: "",
    propertyOwner: {
      name: "",
      email: "",
      contactNo: "",
    },
  });

  const [errors, setErrors] = useState({});

  const propertyTypes = ["Apartment", "House", "Villa", "Plot", "Commercial"];
  const furnishedOptions = ["Furnished", "Semi-Furnished", "Unfurnished"];
  const statusOptions = ["For Sale", "For Rent", "Under Construction"];
  const areaUnits = ["sq.ft.", "sq.m", "acres", "hectares"];

  const { addProperty, isLoading } = useSellerStore();

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.title) newErrors.title = "Title is required";
      if (!formData.price) newErrors.price = "Price is required";
      if (!formData.propertyType)
        newErrors.propertyType = "Property type is required";
      if (!formData.status) newErrors.status = "Status is required";
    }

    if (step === 2) {
      if (!formData.location.address) newErrors.address = "Address is required";
      if (!formData.location.city) newErrors.city = "City is required";
      if (!formData.location.state) newErrors.state = "State is required";
      if (!formData.location.country) newErrors.country = "Country is required";
      if (!formData.location.pinCode)
        newErrors.pinCode = "Pin code is required";
      else if (!/^\d{6}$/.test(formData.location.pinCode))
        newErrors.pinCode = "Pin code must be 6 digits";
    }

    if (step === 3) {
      if (!formData.description)
        newErrors.description = "Description is required";
      if (!formData.furnishedStatus)
        newErrors.furnishedStatus = "Furnished status is required";
      if (!formData.totalFloors)
        newErrors.totalFloors = "Total floors is required";
    }

    if (step === 4) {
      if (!formData.propertyOwner.name)
        newErrors.ownerName = "Owner name is required";
      if (!formData.propertyOwner.email)
        newErrors.ownerEmail = "Owner email is required";
      else if (!/^\S+@\S+\.\S+$/.test(formData.propertyOwner.email))
        newErrors.ownerEmail = "Invalid email format";
      if (!formData.propertyOwner.contactNo)
        newErrors.ownerContact = "Contact number is required";
      else if (!/^\d{10}$/.test(formData.propertyOwner.contactNo))
        newErrors.ownerContact = "Contact must be 10 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child, grandchild] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: grandchild
            ? {
                ...prev[parent][child],
                [grandchild]: value,
              }
            : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      setFormData((prev) => ({
        ...prev,
        images: [
          ...prev.images,
          {
            imageFile: file,
            previewUrl: URL.createObjectURL(file), // optional for preview
          },
        ],
      }));
    });
  };

  const removeImage = (previewUrl) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((img) => img.previewUrl !== previewUrl),
    }));
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4)); // Minimum steps are 4
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      const propertyFormData = new FormData();

      // Appending images into FormData
      if (formData.images) {
        for (const image of formData.images) {
          propertyFormData.append("files", image.imageFile); // Make sure imageUrl is a File object
        }
      }

      // Helper function to flatten and append nested object keys
      const appendFormData = (data, parentKey = "") => {
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            const value = data[key];
            const formKey = parentKey ? `${parentKey}.${key}` : key;

            if (
              value !== null &&
              typeof value === "object" &&
              !(value instanceof File) &&
              !Array.isArray(value)
            ) {
              appendFormData(value, formKey); // Recurse for nested objects
            } else {
              propertyFormData.append(formKey, value);
            }
          }
        }
      };

      // Append all fields except images
      const { images, ...otherData } = formData;
      appendFormData(otherData);

      /* // Debug: log all entries
      for (const [key, value] of propertyFormData.entries()) {
        console.log(key, value);
      }
      console.log("Form submitted."); */
      const result = await addProperty(propertyFormData);
      if (result.success) {
        setFormData(initialState);
        setCurrentStep(1);
      }
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Home className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Basic Information</h2>
        <p className="text-gray-600">
          Let's start with the basics about your property
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="e.g., Beautiful 3BHK Apartment"
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price *
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange("price", e.target.value)}
              className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter price"
            />
          </div>
          {errors.price && (
            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Property Type *
          </label>
          <select
            value={formData.propertyType}
            onChange={(e) => handleInputChange("propertyType", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
              errors.propertyType ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select property type</option>
            {propertyTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {errors.propertyType && (
            <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select
            value={formData.status}
            onChange={(e) => handleInputChange("status", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
              errors.status ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select status</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="text-red-500 text-sm mt-1">{errors.status}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Location Details</h2>
        <p className="text-gray-600">Tell us where your property is located</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Address *
          </label>
          <input
            type="text"
            value={formData.location.address}
            onChange={(e) =>
              handleInputChange("location.address", e.target.value)
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
              errors.address ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter full address"
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            value={formData.location.city}
            onChange={(e) => handleInputChange("location.city", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
              errors.city ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter city"
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            State *
          </label>
          <input
            type="text"
            value={formData.location.state}
            onChange={(e) =>
              handleInputChange("location.state", e.target.value)
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
              errors.state ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter state"
          />
          {errors.state && (
            <p className="text-red-500 text-sm mt-1">{errors.state}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Country *
          </label>
          <input
            type="text"
            value={formData.location.country}
            onChange={(e) =>
              handleInputChange("location.country", e.target.value)
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
              errors.country ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter country"
          />
          {errors.country && (
            <p className="text-red-500 text-sm mt-1">{errors.country}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pin Code *
          </label>
          <input
            type="text"
            value={formData.location.pinCode}
            onChange={(e) =>
              handleInputChange("location.pinCode", e.target.value)
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
              errors.pinCode ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter pin code"
          />
          {errors.pinCode && (
            <p className="text-red-500 text-sm mt-1">{errors.pinCode}</p>
          )}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Coordinates (Optional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              value={formData.location.coordinates.latitude}
              onChange={(e) =>
                handleInputChange(
                  "location.coordinates.latitude",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter latitude"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={formData.location.coordinates.longitude}
              onChange={(e) =>
                handleInputChange(
                  "location.coordinates.longitude",
                  e.target.value
                )
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Enter longitude"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Property Details</h2>
        <p className="text-gray-600">
          Provide detailed information about your property
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          rows="4"
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Describe your property in detail..."
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Plot Area
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={formData.plotArea.area}
              onChange={(e) =>
                handleInputChange("plotArea.area", e.target.value)
              }
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Area"
            />
            <select
              value={formData.plotArea.areaIn}
              onChange={(e) =>
                handleInputChange("plotArea.areaIn", e.target.value)
              }
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              {areaUnits.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Floors *
          </label>
          <input
            type="number"
            value={formData.totalFloors}
            onChange={(e) => handleInputChange("totalFloors", e.target.value)}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
              errors.totalFloors ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Number of floors"
          />
          {errors.totalFloors && (
            <p className="text-red-500 text-sm mt-1">{errors.totalFloors}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bedrooms
          </label>
          <div className="relative">
            <Bed className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={formData.numberOfBedrooms}
              onChange={(e) =>
                handleInputChange("numberOfBedrooms", e.target.value)
              }
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Number of bedrooms"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bathrooms
          </label>
          <div className="relative">
            <Bath className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="number"
              value={formData.numberOfBathrooms}
              onChange={(e) =>
                handleInputChange("numberOfBathrooms", e.target.value)
              }
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="Number of bathrooms"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Balconies
          </label>
          <input
            type="number"
            value={formData.numberOfBalconies}
            onChange={(e) =>
              handleInputChange("numberOfBalconies", e.target.value)
            }
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            placeholder="Number of balconies"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Furnished Status *
          </label>
          <select
            value={formData.furnishedStatus}
            onChange={(e) =>
              handleInputChange("furnishedStatus", e.target.value)
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
              errors.furnishedStatus ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Select furnished status</option>
            {furnishedOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.furnishedStatus && (
            <p className="text-red-500 text-sm mt-1">
              {errors.furnishedStatus}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Property Images
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">
            Upload property images (Less than 5MB each)
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
          >
            <Upload className="w-4 h-4 mr-2" />
            Choose Images
          </label>
        </div>

        {formData.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {formData.images.map((image, index) => (
              <div key={image.public_id} className="relative">
                <img
                  src={image.previewUrl}
                  alt={`Property ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(image.previewUrl)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800">Owner Information</h2>
        <p className="text-gray-600">
          Provide contact details for the property owner
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Owner Name *
          </label>
          <input
            type="text"
            value={formData.propertyOwner.name}
            onChange={(e) =>
              handleInputChange("propertyOwner.name", e.target.value)
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
              errors.ownerName ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter owner name"
          />
          {errors.ownerName && (
            <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={formData.propertyOwner.email}
            onChange={(e) =>
              handleInputChange("propertyOwner.email", e.target.value)
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
              errors.ownerEmail ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter email address"
          />
          {errors.ownerEmail && (
            <p className="text-red-500 text-sm mt-1">{errors.ownerEmail}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Number *
          </label>
          <input
            type="tel"
            value={formData.propertyOwner.contactNo}
            onChange={(e) =>
              handleInputChange("propertyOwner.contactNo", e.target.value)
            }
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
              errors.ownerContact ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter 10-digit contact number"
          />
          {errors.ownerContact && (
            <p className="text-red-500 text-sm mt-1">{errors.ownerContact}</p>
          )}
        </div>
      </div>
    </div>
  );

  const steps = [
    { number: 1, title: "Basic Info", icon: Home },
    { number: 2, title: "Location", icon: MapPin },
    { number: 3, title: "Details", icon: FileText },
    { number: 4, title: "Owner Info", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const IconComponent = step.icon;
                return (
                  <div
                    key={step.number}
                    className="hidden md:flex items-center"
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        currentStep >= step.number
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="ml-3">
                      <p
                        className={`text-sm font-medium ${
                          currentStep >= step.number
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      >
                        Step {step.number}
                      </p>
                      <p
                        className={`text-xs ${
                          currentStep >= step.number
                            ? "text-gray-900"
                            : "text-gray-400"
                        }`}
                      >
                        {step.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-16 h-0.5 mx-4 ${
                          currentStep > step.number
                            ? "bg-blue-600"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content */}
          <div>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              {/* Previous Button */}
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
                  currentStep === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Previous
              </button>
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
                >
                  Next
                  <ChevronRight className="w-5 h-5 ml-2" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="flex items-center px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all shadow-lg hover:shadow-xl disabled:bg-green-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <LoaderIcon className="w-5 h-5 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-5 h-5 mr-2" />
                  )}
                  Submit Listing
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListingForm;
