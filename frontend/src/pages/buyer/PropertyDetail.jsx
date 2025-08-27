import { useParams } from "react-router-dom";
import ImageCarousel from "../../Components/ImageCarousel";
import { errorMessage } from "../../Utils/HandleToast";
import { useEffect } from "react";
import { useBuyerStore } from "../../Store/BuyerStore";

const PropertyDetail = () => {
  const { propertyId } = useParams();
  const { fetchProperty, property } = useBuyerStore();

  useEffect(() => {
    if (!propertyId) {
      return errorMessage("Something Went Wrong with propertyId");
    }
    fetchProperty(propertyId);
  }, []);

  const images =
    property.images &&
    Array.isArray(property.images) &&
    property.images.length > 0
      ? property.images
      : [{ imageUrl: "/images/placeholder.jpg" }];

  if (!property) {
    errorMessage("Property data not found");
    return <div className="p-4">Property not found</div>;
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatArea = (area, unit) => {
    if (!area || !unit) return "Not specified";
    return `${area} ${unit}`;
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* Image Carousel */}
      <div className="mb-8">
        <ImageCarousel images={images} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="sm:flex sm:justify-between sm:items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {property.title}
                </h1>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">
                    {property.status}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    {property.propertyType}
                  </span>
                </div>
                <p className="text-gray-600">
                  {property.location?.address}, {property.location?.city},{" "}
                  {property.location?.state}, {property.location?.country} -{" "}
                  {property.location?.pinCode}
                </p>
              </div>
              <div className="sm:text-right mt-2 sm:mt-0">
                <p className="text-3xl font-bold text-blue-600">
                  {formatPrice(property.price)}
                </p>
                <div className="flex items-center text-sm text-gray-500 mt-2">
                  <span className="mr-4">👁️ {property.views || 0} views</span>
                  <span>❤️ {property.favorites || 0} favorites</span>
                </div>
              </div>
            </div>
          </div>

          {/* Property Features */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Property Features
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-1">🛏️</div>
                <div className="font-semibold">
                  {property.numberOfBedrooms || 0}
                </div>
                <div className="text-sm text-gray-600">Bedrooms</div>
              </div>

              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-1">🚿</div>
                <div className="font-semibold">
                  {property.numberOfBathrooms || 0}
                </div>
                <div className="text-sm text-gray-600">Bathrooms</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl mb-1">🏔️</div>
                <div className="font-semibold">
                  {property.numberOfBalconies || 0}
                </div>
                <div className="text-sm text-gray-600">Balconies</div>
              </div>
              {property.totalFloors !== undefined && (
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-1">🏢</div>
                  <div className="font-semibold">
                    {property.totalFloors === 0
                      ? "Ground"
                      : property.totalFloors}
                  </div>
                  <div className="text-sm text-gray-600">Floor</div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Additional Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {property.plotArea && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Plot Area</span>
                  <span className="font-medium">
                    {formatArea(
                      property.plotArea.area,
                      property.plotArea.areaIn
                    )}
                  </span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Furnished Status</span>
                <span className="font-medium">{property.furnishedStatus}</span>
              </div>
              {property.listedBy && (
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Listed By</span>
                  <span className="font-medium">{property.listedBy}</span>
                </div>
              )}
              <div className="flex justify-between py-2 border-b border-gray-200">
                <span className="text-gray-600">Listed On</span>
                <span className="font-medium">
                  {property.createdAt
                    ? new Date(property.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>
          )}

          {/* Location Details */}
          {property.location && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Location
              </h2>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {property.location.address}
                </p>
                <p>
                  <span className="font-medium">City:</span>{" "}
                  {property.location.city}
                </p>
                <p>
                  <span className="font-medium">State:</span>{" "}
                  {property.location.state}
                </p>
                <p>
                  <span className="font-medium">Country:</span>{" "}
                  {property.location.country}
                </p>
                <p>
                  <span className="font-medium">PIN Code:</span>{" "}
                  {property.location.pinCode}
                </p>
                {property.location.coordinates && (
                  <p>
                    <span className="font-medium">Coordinates:</span>{" "}
                    {property.location.coordinates.latitude},{" "}
                    {property.location.coordinates.longitude}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Contact Owner */}
          {property.propertyOwner && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Contact Owner
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-900">
                    {property.propertyOwner.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <a
                    href={`mailto:${property.propertyOwner.email}`}
                    className="text-blue-600 hover:text-blue-800 break-all"
                  >
                    {property.propertyOwner.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <a
                    href={`tel:${property.propertyOwner.contactNo}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {property.propertyOwner.contactNo}
                  </a>
                </div>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                  Contact Owner
                </button>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Views</span>
                <span className="font-medium">{property.views || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Favorites</span>
                <span className="font-medium">{property.favorites || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium text-sm">
                  {property.updatedAt
                    ? new Date(property.updatedAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
