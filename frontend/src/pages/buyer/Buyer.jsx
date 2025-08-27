import { Bell, ChevronDown, Crown, Filter, House, Search } from "lucide-react";
import { useAuthStore } from "../../Store/authStore";
import { useEffect, useState } from "react";
import { useBuyerStore } from "../../Store/BuyerStore";
import BuyerPropertyCard from "../../Components/buyer/BuyerPropertyCard";
import { useNavigate } from "react-router-dom";

const Buyer = () => {
  const { user, logout } = useAuthStore();
  const { fetchAllProperties, fetchUserFav, properties, isLoading } =
    useBuyerStore();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // States for Filter functionality
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFurnishedStatus, setFilterFurnishedStatus] = useState("all"); //("Furnished", "Semi-Furnished", "Unfurnished")
  const [filterType, setFilterType] = useState("all"); // ("Apartment", "House", "Villa", "Plot", "Commercial")

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

  useEffect(() => {
    fetchAllProperties();
    fetchUserFav();
  }, []);

  const handleLogout = async () => {
    const response = await logout();
    if (response.data.success) {
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  };

  const filteredProperties = Array.isArray(properties)
    ? properties.filter((property) => {
        const matchesSearch =
          property.title.toLowerCase().includes(searchTerm) ||
          property.location.address.toLowerCase().includes(searchTerm) ||
          property.location.city.toLowerCase().includes(searchTerm) ||
          property.location.state.toLowerCase().includes(searchTerm) ||
          property.description.toLowerCase().includes(searchTerm);

        const matchesFurnishedStatus =
          filterFurnishedStatus === "all" ||
          property.furnishedStatus === filterFurnishedStatus;
        const matchesFilterType =
          filterType === "all" || property.propertyType === filterType;
        return matchesSearch && matchesFurnishedStatus && matchesFilterType;
      })
    : [];

  const LoadingSkeleton = () => (
    <div className="animate-pulse space-y-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="bg-white/60 rounded-2xl p-6 m-2">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
            <div className="w-32 h-4 bg-gray-200 rounded"></div>
            <div className="w-24 h-3 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-3 mt-6">
            <div className="flex justify-between">
              <div className="w-20 h-3 bg-gray-200 rounded"></div>
              <div className="w-32 h-3 bg-gray-200 rounded"></div>
            </div>
            <div className="flex justify-between">
              <div className="w-24 h-3 bg-gray-200 rounded"></div>
              <div className="w-28 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="w-full h-12 bg-gray-200 rounded-xl mt-6"></div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="col-span-full flex flex-col items-center justify-center py-20 px-4">
      <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
        <House className="w-12 h-12 text-purple-400" />
      </div>
      <h3 className="text-2xl font-nunito-bold text-gray-700 mb-2">
        No Properties Found
      </h3>
      <p className="text-gray-500 text-center max-w-md">
        {searchTerm || filterFurnishedStatus !== "all" || filterType !== "all"
          ? "Try adjusting your search or filter criteria"
          : "No Properties have been added to the system yet"}
      </p>
      {(searchTerm ||
        filterFurnishedStatus !== "all" ||
        filterType !== "all") && (
        <button
          onClick={() => {
            setSearchTerm("");
            setFilterType("all");
            setFilterFurnishedStatus("all");
          }}
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
        >
          Clear Filters
        </button>
      )}
    </div>
  );

  return (
    <div>
      {/* Top navigation */}
      <header className="bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-200 z-30 relative">
        <div className="flex items-center justify-between p-4 lg:p-6">
          <div>
            <h1 className="text-xl lg:text-2xl font-nunito-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome back, {user.username}
            </h1>
            <p className="text-xs lg:text-sm text-gray-500">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="flex items-center gap-2 lg:gap-3">
            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-2 h-2 lg:w-3 lg:h-3 bg-red-500 rounded-full"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 lg:w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
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
                className="flex items-center gap-1 lg:gap-2 p-1 lg:p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <img
                  src={user.profilePicUrl}
                  alt="Profile"
                  className="w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 border-gray-200"
                />
                <ChevronDown className="w-3 h-3 lg:w-4 lg:h-4 text-gray-600" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
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
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-2 sm:p-4">
        {/* Header Section */}
        <div className="mb-8">
          {/* Search and Filter bars */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 z-10 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, location or desc..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
              />
            </div>

            {/* Filter for furnished status  */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 z-10 -translate-y-1/2 w-5 h-5 text-black-400" />
              <select
                value={filterFurnishedStatus}
                onChange={(e) => setFilterFurnishedStatus(e.target.value)}
                className="pl-12 pr-8 py-3 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer min-w-[140px]"
              >
                <option value="all">All Furnished Status</option>
                <option value="Furnished">Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>

            {/* Filter for type  */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 z-10 -translate-y-1/2 w-5 h-5 text-black-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="pl-12 pr-8 py-3 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 cursor-pointer min-w-[140px]"
              >
                <option value="all">All Type</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Plot">Plot</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-lg border border-purple-100">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                Total: {Array.isArray(properties) ? properties.length : 0}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-lg border border-purple-100">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">
                Showing: {filteredProperties.length}
              </span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-purple-100 p-4 sm:p-6 shadow-xl">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <LoadingSkeleton />
            </div>
          ) : filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-6">
              {filteredProperties.map((property, idx) => (
                <div
                  key={idx}
                  className="opacity-0 animate-fadeIn"
                  style={{
                    animationDelay: `${idx * 0.1}s`,
                    animationFillMode: "forwards",
                  }}
                >
                  {/* Property Cards */}
                  <BuyerPropertyCard
                    propertyId={property._id}
                    image={
                      property.images[0]?.imageUrl || "/images/placeholder.jpg"
                    }
                    images={property.images}
                    title={property.title}
                    description={property.description}
                    price={property.price}
                    location={property.location}
                    favorites={property.favorites}
                    views={property.views}
                    isLoading
                  />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
        {/* Custom Animation Styles */}
        <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
      </div>
    </div>
  );
};

export default Buyer;
