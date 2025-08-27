import { useState } from "react";
import { User, Mail, Lock, Upload, EyeClosed, Eye } from "lucide-react";
import { useAuthStore } from "../../Store/authStore";
import Button from "../../Components/Button";
import { errorMessage, successMessage } from "../../Utils/HandleToast";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const authStore = useAuthStore();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
    role: "",
    profileImage: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Handle image input
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setUserData((prev) => ({ ...prev, profileImage: file }));

      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !userData.username ||
      !userData.email ||
      !userData.password ||
      !userData.profileImage ||
      !userData.role
    ) {
      return errorMessage("All fields required!");
    }

    const formData = new FormData();
    // Append the actual file (profileImage) - important!
    if (userData.profileImage) {
      formData.append("file", userData.profileImage);
    }

    // Append other fields except profileImage
    Object.keys(userData).forEach((key) => {
      if (key !== "profileImage") {
        formData.append(key, userData[key]);
      }
    });

    const result = await authStore.signup(formData);
    if (result.success || result.user) {
      navigate("/verify-email", {
        state: { email: userData.email },
      });
    }
  };

  const handlePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full flex flex-col lg:flex-row min-h-[600px]">
        {/* Left Side - Modern House Image */}
        <div className="lg:w-1/2 relative min-h-[300px] lg:min-h-full">
          {/* Gradient overlay for image */}
          {/* <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20"></div> */}
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Modern House"
            className="w-full h-full object-cover "
          />
          <div className="absolute bottom-8 left-8 right-8 hidden sm:block">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-nunito-bold text-gray-900 mb-2">
                Find Your Dream Home
              </h3>
              <p className="text-gray-600">
                Join thousands of users who trust our platform for their real
                estate needs.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-30 md:w-40 rounded-full mb-4">
                {/* <Home className="w-8 h-8 text-white" /> */}
                <img src="/images/logo.png" alt="" />
              </div>
              <h1 className="text-3xl font-nunito-bold text-gray-900 mb-2">
                Join Us Today
              </h1>
              <p className="text-gray-600">
                Create your account to get started
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6">
              {/* Profile Image Upload */}
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <input
                    type="file"
                    name="profileImage"
                    accept="image/*"
                    onChange={handleChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Click to upload profile picture
                </p>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="username"
                    value={userData.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter your username"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-black"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-black"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={`${isPasswordVisible ? "text" : "password"}`}
                    name="password"
                    value={userData.password}
                    onChange={handleChange}
                    required
                    placeholder="Create a password"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-black"
                  />
                  {isPasswordVisible ? (
                    <EyeClosed
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                      onClick={handlePasswordVisibility}
                    />
                  ) : (
                    <Eye
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                      onClick={handlePasswordVisibility}
                    />
                  )}
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Your Role
                </label>
                <select
                  name="role"
                  value={userData.role}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-black bg-white"
                >
                  <option value="">Choose your role</option>
                  <option value="buyer">🏠 Property Buyer</option>
                  <option value="seller">💼 Property Seller</option>
                </select>
              </div>

              {/* Submit Button */}
              <Button
                handleOnClick={handleSubmit}
                isDisabled={authStore.isLoading}
                isVerifying={authStore.isLoading}
                textDisabled={"Registering..."}
                text={"Register"}
              />

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                >
                  Login in here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
