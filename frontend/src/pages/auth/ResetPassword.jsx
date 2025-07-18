import { Eye, EyeClosed, Lock } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "../../Store/authStore";
import Button from "../../Components/Button";
import { errorMessage } from "../../Utils/HandleToast";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const authStore = useAuthStore();
  const { resetToken } = useParams();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetPassword = () => {
    const { password, confirmPassword } = passwords;
    if (!password || !confirmPassword) {
      return errorMessage("Please enter both password and confirm password.");
    }
    if (password !== confirmPassword) {
      return errorMessage("Passwords do not match.");
    }
    if (!resetToken) {
      return errorMessage("Invalid or missing password reset token.");
    }
    authStore.resetPassword(resetToken, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden w-full max-w-md relative">
        {/* Header with logo area */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-6 text-center relative">
          {/* Nest Finders Logo */}
          <div className="flex items-center justify-center mb-2">
            <div className="w-16 h-16  backdrop-blur-sm rounded-xl flex items-center justify-center mr-3">
              <img src="/images/logo.png" />
            </div>
            <div>
              <h1 className="text-white text-xl font-nunito-bold font-nunito-bold">
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
              Reset Password
            </h2>
            <p className="text-gray-600">Enter your new password</p>
          </div>

          {/* New Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={`${isPasswordVisible ? "text" : "password"}`}
                name="password"
                value={passwords.password}
                onChange={handleChange}
                required
                placeholder="Enter new password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-black"
              />
              {isPasswordVisible ? (
                <EyeClosed
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  onClick={() => setIsPasswordVisible((prev) => !prev)}
                />
              ) : (
                <Eye
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  onClick={() => setIsPasswordVisible((prev) => !prev)}
                />
              )}
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={`${isConfirmPasswordVisible ? "text" : "password"}`}
                name="confirmPassword"
                value={passwords.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Enter confirm password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 text-black"
              />
              {isConfirmPasswordVisible ? (
                <EyeClosed
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
                />
              ) : (
                <Eye
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  onClick={() => setIsConfirmPasswordVisible((prev) => !prev)}
                />
              )}
            </div>
          </div>

          {/* Verify Button */}
          <Button
            handleOnClick={handleResetPassword}
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

export default ResetPassword;
