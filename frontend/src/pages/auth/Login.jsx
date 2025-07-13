import { useState } from "react";
import { Mail, Lock, Eye, EyeClosed } from "lucide-react";
import { useAuthStore } from "../../Store/authStore";
import Button from "../../Components/Button";
import { errorMessage, successMessage } from "../../Utils/HandleToast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const authStore = useAuthStore();
  const navigate = useNavigate();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData.email || !userData.password) {
      return errorMessage("All fields required!");
    }

    const result = await authStore.login(userData);
    if (result.success || result.user) {
      navigate("/"); // Navigate to home screen
    }
  };

  const handlePasswordVisiblity = () => {
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
                Welcome Back!
              </h1>
              <p className="text-gray-600">
                Login into your account to get started
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6">
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
                      onClick={handlePasswordVisiblity}
                    />
                  ) : (
                    <Eye
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                      onClick={handlePasswordVisiblity}
                    />
                  )}
                </div>
                <a
                  href="/forgot-password"
                  className="text-blue-600 hover:text-blue-800 text-xs mt-2 font-medium transition-colors duration-200"
                >
                  Forgot Password
                </a>
              </div>

              {/* Submit Button */}
              <Button
                handleOnClick={handleSubmit}
                isDisabled={authStore.isLoading}
                isVerifying={authStore.isLoading}
                textDisabled={"Login..."}
                text={"Login"}
              />

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600">
                Create a new account?{" "}
                <a
                  href="/signup"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                >
                  Sign up here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
