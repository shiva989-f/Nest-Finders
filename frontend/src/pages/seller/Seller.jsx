import { useState } from "react";
import {
  Bell,
  Menu,
  X,
  Crown,
  Shield,
  ChevronDown,
  HousePlus,
  LayoutList,
  Store,
} from "lucide-react";
import { useAuthStore } from "../../Store/authStore";
import { useNavigate } from "react-router-dom";
import PropertiesTab from "../../Components/admin/PropertiesTab";
import PropertyListingForm from "../../Components/seller/PropertyListingForm";

const Seller = () => {
  const { user, logout } = useAuthStore();
  const [isAddTabSelected, setIsAddTabSelected] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();

  const tabs = [
    {
      id: "addProperty",
      label: "Add Property",
      icon: HousePlus,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "myProperties",
      label: "My Properties",
      icon: LayoutList,
      // count: properties.length,
      color: "from-purple-500 to-purple-600",
    },
  ];

  const notifications = [
    { id: 1, text: "New user registered", time: "2 min ago", type: "user" },
    {
      id: 2,
      text: "Property listing approved",
      time: "5 min ago",
      type: "property",
    },
    {
      id: 3,
      text: "System backup completed",
      time: "1 hour ago",
      type: "system",
    },
  ];

  const handleLogout = () => {
    const response = logout();
    if (response.data.success) {
      setTimeout(() => {
        navigate("/login");
      }, 200);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Main container */}
      <div className="relative z-10 flex h-screen">
        {/* Sidebar - hidden on mobile, can be toggled */}
        <div
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-xl shadow-xl transition-transform duration-300 ease-in-out`}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar header */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <span className="font-nunito-bold text-lg">Seller Panel</span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-1 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setIsAddTabSelected(tab.id === "addProperty");
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                    (tab.id === "addProperty" && isAddTabSelected) ||
                    (tab.id === "myProperties" && !isAddTabSelected)
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg`
                      : "hover:bg-gray-100 text-gray-700 hover:text-gray-900"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>

            {/* Sidebar footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <Shield className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    System Status
                  </p>
                  <p className="text-xs text-green-600">
                    All systems operational
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top navigation */}
          <header className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-200 z-100">
            <div className="flex items-center justify-between p-4 lg:p-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <div>
                  <h1 className="text-2xl font-nunito-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Welcome back, {user.username}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                  </button>

                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-100">
                        <h3 className="font-semibold text-gray-800">
                          Notifications
                        </h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className="p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                          >
                            <p className="text-sm text-gray-800">
                              {notification.text}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <img
                      src={user.profilePicUrl}
                      alt="Profile"
                      className="w-8 h-8 rounded-full border-2 border-gray-200"
                    />
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-1000">
                      <div className="p-2">
                        {/* Profile button is dummy button */}
                        <button className="w-full flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors text-left">
                          <Crown className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">Profile</span>
                        </button>
                        <hr className="my-2 border-gray-200" />
                        <button
                          className="w-full flex items-center gap-3 p-2 hover:bg-red-50 rounded-lg transition-colors text-left"
                          onClick={handleLogout}
                        >
                          <span className="text-sm text-red-600">Sign out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* Content area */}
          <main className="flex-1 overflow-auto">
            {/* Tab content */}
            <div className="p-4 lg:p-6">
              {isAddTabSelected ? <PropertyListingForm /> : <PropertiesTab />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Seller;
