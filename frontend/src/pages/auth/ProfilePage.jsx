import { User, Mail, Briefcase, LogOut } from "lucide-react";
import { useAuthStore } from "../../Store/authStore";

const ProfilePage = () => {
  const { user, logout } = useAuthStore();
  const profileData = {
    username: user.username,
    email: user.email,
    role: user.role,
    profilePic: user.profilePicUrl,
  };
  
  const handleLogout = async () => {
    const response = await logout();
    if (response?.data?.success) {
      setTimeout(() => {
        navigate("/login");
      }, 200);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-12 text-white">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Profile Picture */}
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <img
                  src={profileData?.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">
                  {profileData.username}
                </h1>
                <p className="text-xl text-blue-100">
                  {profileData.role.charAt(0).toUpperCase() +
                    profileData.role.slice(1).toLowerCase()}
                  {/* Making the role display in capital case */}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Profile Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Username */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <User className="text-blue-600" size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-700">Username</h3>
                </div>
                <p className="text-gray-800 font-medium">
                  {profileData.username}
                </p>
              </div>

              {/* Email */}
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Mail className="text-green-600" size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-700">Email</h3>
                </div>
                <p className="text-gray-800 font-medium">{profileData.email}</p>
              </div>

              {/* Role */}
              <div className="bg-gray-50 rounded-xl p-6 md:col-span-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Briefcase className="text-purple-600" size={20} />
                  </div>
                  <h3 className="font-semibold text-gray-700">Role</h3>
                </div>
                <p className="text-gray-800 font-medium">
                  {profileData.role.charAt(0).toUpperCase() +
                    profileData.role.slice(1).toLowerCase()}
                </p>
              </div>
            </div>

            {/* Logout Button at Bottom */}
            <div className="flex justify-center mt-8 text-white">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-6 py-3 rounded-lg transition-colors duration-200 font-medium shadow-lg"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
