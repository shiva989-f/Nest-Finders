import { useEffect, useState } from "react";
import { Filter, House, RefreshCw, Search } from "lucide-react";
import { useSellerStore } from "../../Store/SellerStore";
import SellerPropertyCard from "./SellerPropertyCard";

const ListedPropertiesTab = () => {
  const { fetchListedProperties, properties, isLoading } = useSellerStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterFurnishedStatus, setFilterFurnishedStatus] = useState("all"); //("Furnished", "Semi-Furnished", "Unfurnished")
  const [filterType, setFilterType] = useState("all"); // ("Apartment", "House", "Villa", "Plot", "Commercial")
  const [isRefreshing, setIsRefreshing] = useState(false);
  useEffect(() => {
    fetchListedProperties();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchListedProperties();
    setIsRefreshing(false);
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-2 sm:p-4">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white flex items-center justify-center rounded-xl shadow-lg">
              <House className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-nunito-bold">
                Properties Management
              </h1>
              <p className="text-gray-600 text-sm sm:text-base">
                Manage and monitor all platform properties
              </p>
            </div>
          </div>
          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-purple-200 rounded-lg hover:bg-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          >
            <RefreshCw
              className={`w-4 h-4 text-purple-600 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
            <span className="text-purple-600 font-medium">Refresh</span>
          </button>
        </div>

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
                <SellerPropertyCard
                  propertyId={property._id}
                  image={
                    property.images[0]?.imageUrl || "/images/placeholder.jpg"
                  }
                  title={property.title}
                  description={property.description}
                  price={property.price}
                  location={property.location}
                  favorites={property.favorites}
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
  );
};

export default ListedPropertiesTab;
