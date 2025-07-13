import { Trash2, Shield, Mail, User } from "lucide-react";
import { useState } from "react";
import { useAdminStore } from "../../Store/AdminStore";

const UserCard = ({
  userId,
  username,
  email,
  profilePicUrl,
  isVerified,
  role,
}) => {
  const { deleteUser } = useAdminStore();
  const [isHovered, setIsHovered] = useState(false);

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case "seller":
        return "text-blue-600 bg-blue-50";
      case "buyer":
        return "text-green-600 bg-green-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toLowerCase()) {
      case "seller":
        return <Shield className="w-4 h-4" />;
      case "buyer":
        return <User className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const handleDeleteUser = (userId) => {
    console.log(userId);

    deleteUser(userId);
  };

  return (
    <div
      className="relative group bg-gradient-to-br from-white via-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 m-2 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-purple-50/20 to-pink-50/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Profile section */}
      <div className="relative flex flex-col items-center mb-6">
        <div className="relative">
          <img
            src={profilePicUrl}
            alt="Profile Picture"
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300"
          />
          {isVerified && (
            <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1.5 shadow-lg">
              <Shield className="w-3 h-3" />
            </div>
          )}
        </div>

        {/* Username with gradient */}
        <h3 className="mt-4 text-xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
          {username}
        </h3>

        {/* Role badge */}
        <div
          className={`mt-2 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getRoleColor(
            role
          )}`}
        >
          {getRoleIcon(role)}
          {role}
        </div>
      </div>

      {/* Info section */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
          <Mail className="w-5 h-5 text-blue-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-sm text-gray-900 truncate">{email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
          <Shield className="w-5 h-5 text-green-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">
              Verification Status
            </p>
            <p
              className={`text-sm font-medium ${
                isVerified ? "text-green-600" : "text-orange-600"
              }`}
            >
              {isVerified ? "Verified Account" : "Unverified Account"}
            </p>
          </div>
        </div>
      </div>

      {/* Action button */}
      <button
        className="w-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-red-600 hover:via-red-700 hover:to-red-800 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group/btn"
        onClick={handleDeleteUser(userId)}
      >
        <Trash2 className="w-5 h-5 group-hover/btn:animate-pulse" />
        <span>Delete User</span>

        {/* Button shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 rounded-xl" />
      </button>

      {/* Hover glow effect */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 opacity-0 blur-xl transition-opacity duration-500 -z-10 ${
          isHovered ? "opacity-100" : ""
        }`}
      />
    </div>
  );
};

export default UserCard;
