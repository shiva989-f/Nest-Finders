import { useState, useEffect, useRef } from "react";
import { Mail, Shield, ArrowLeft, CheckCircle } from "lucide-react";

export default function App() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(120);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) return;

    setIsVerifying(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
    }, 2000);
  };

  const handleResend = async () => {
    setIsResending(true);
    setTimer(120);
    
    // Simulate resend API call
    setTimeout(() => {
      setIsResending(false);
    }, 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Verified Successfully!</h1>
          <p className="text-gray-600 mb-8">Welcome to Nest Finders. Your account is now verified and ready to use.</p>
          <button className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            Continue to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-pink-300/15 to-blue-300/15 rounded-full blur-2xl"></div>

      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden w-full max-w-md relative">
        {/* Header with logo area */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 p-6 text-center relative">
          <div className="absolute top-4 left-4">
            <button className="text-white/80 hover:text-white transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </div>
          
          {/* Nest Finders Logo */}
          <div className="flex items-center justify-center mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mr-3">
              <div className="w-8 h-8 bg-white/30 rounded-lg relative">
                <div className="absolute inset-1 bg-white/50 rounded transform rotate-45"></div>
              </div>
            </div>
            <div>
              <h1 className="text-white text-xl font-bold">NEST FINDERS</h1>
              <p className="text-white/80 text-xs">Premium Real Estate</p>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="p-8">
          {/* Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Account</h2>
            <p className="text-gray-600">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-purple-600 font-semibold flex items-center justify-center mt-1">
              <Mail className="w-4 h-4 mr-2" />
              john@example.com
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-8">
            <div className="flex justify-center space-x-3 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => inputRefs.current[index] = el}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 bg-gray-50 focus:bg-white"
                  inputMode="numeric"
                />
              ))}
            </div>
            
            {/* Timer */}
            <div className="text-center">
              {timer > 0 ? (
                <p className="text-gray-500 text-sm">
                  Code expires in <span className="font-semibold text-purple-600">{formatTime(timer)}</span>
                </p>
              ) : (
                <p className="text-red-500 text-sm font-medium">Code expired</p>
              )}
            </div>
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={otp.join("").length !== 6 || isVerifying}
            className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-4 px-6 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 transition-all duration-300 mb-4 relative overflow-hidden"
          >
            {isVerifying ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                Verifying...
              </div>
            ) : (
              "Verify Code"
            )}
          </button>

          {/* Resend Code */}
          <div className="text-center">
            <p className="text-gray-600 text-sm mb-2">Didn't receive the code?</p>
            <button
              onClick={handleResend}
              disabled={timer > 0 || isResending}
              className="text-purple-600 hover:text-purple-800 font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isResending ? "Sending..." : "Resend Code"}
            </button>
          </div>

          {/* Help text */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
            <p className="text-xs text-gray-600 text-center">
              Having trouble? Check your spam folder or contact our support team for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}