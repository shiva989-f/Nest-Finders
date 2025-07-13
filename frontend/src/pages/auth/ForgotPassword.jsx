import { ArrowLeft, Lock, Mail } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../Components/Button";
import { errorMessage } from "../../Utils/HandleToast";
import { useAuthStore } from "../../Store/authStore";

const ForgotPassword = () => {
  const authStore = useAuthStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSendLink = () => {
    if (!email) {
      return errorMessage("Enter email to get reset link!");
    }
    authStore.forgotPassword(email);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden w-full max-w-md relative">
        {/* Header with logo area */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-6 text-center relative">
          <div className="absolute top-4 left-4">
            <button
              className="text-white/80 hover:text-white transition-colors"
              onClick={() => navigate("/login")}
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>

          {/* Nest Finders Logo */}
          <div className="flex items-center justify-center mb-2">
            <div className="w-16 h-16  backdrop-blur-sm rounded-xl flex items-center justify-center mr-3">
              <img src="/images/logo.png" />
            </div>
            <div>
              <h1 className="text-white text-xl font-nunito-bold">
                NEST FINDERS
              </h1>
              <p className="text-white/80 text-xs">Premium Real Estate</p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="p-8">
          {/* Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-nunito-bold text-gray-900 mb-2">
              Forgot Password
            </h2>
            <p className="text-gray-600">
              Enter registered email to get reset password link
            </p>
          </div>

          {/* Email */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-black"
              />
            </div>
          </div>

          {/* Verify Button */}
          <Button
            handleOnClick={handleSendLink}
            isDisabled={authStore.isLoading}
            isVerifying={authStore.isLoading}
            textDisabled={"Sending Link..."}
            text={"Send Link"}
          />

          {/* Help text */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
            <p className="text-xs text-gray-600 text-center">
              Having trouble? Check your spam folder or contact our support team
              for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
