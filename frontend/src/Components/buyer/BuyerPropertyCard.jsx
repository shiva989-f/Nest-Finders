import { Heart, MapPin, DollarSign, Eye } from "lucide-react";
import { useState } from "react";

const BuyerPropertyCard = ({
  propertyId,
  image,
  title,
  description,
  favorites,
  price,
  location,
  onFavorite,
  onView,
}) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const truncateDescription = (text, maxWords = 100) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
  };

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price}`;
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    if (onFavorite) {
      onFavorite(propertyId, !isFavorited);
    }
  };

  const handleView = () => {
    if (onView) {
      onView(propertyId);
    }
  };

  return (
    <div className="relative group bg-gradient-to-br from-white via-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 m-2 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1">
      {/* Property Image */}
      <div className="relative mb-6">
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={image || "/api/placeholder/400/250"}
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {!image && (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <Eye className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all duration-200 ${
            isFavorited
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Heart className={`w-5 h-5 ${isFavorited ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Property Title */}
      <h3 className="text-xl font-nunito-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-3">
        {title}
      </h3>

      {/* Description */}
      <p className="text-gray-600 text-sm leading-relaxed mb-4 min-h-[60px]">
        {truncateDescription(description)}
      </p>

      {/* Info section */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
          <MapPin className="w-5 h-5 text-blue-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">Location</p>
            <p className="text-sm text-gray-900 truncate">{location}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
          <DollarSign className="w-5 h-5 text-green-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">Price</p>
            <p className="text-lg font-bold text-green-600">
              {formatPrice(price)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
          <Heart className="w-5 h-5 text-red-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">Favorites</p>
            <p className="text-sm text-gray-900">
              {favorites} people favorited
            </p>
          </div>
        </div>
      </div>

      {/* Action button */}
      <button
        className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group/btn relative overflow-hidden"
        onClick={handleView}
      >
        <Eye className="w-5 h-5 group-hover/btn:animate-pulse" />
        <span>View Property</span>

        {/* Button shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 rounded-xl" />
      </button>
    </div>
  );
};

export default BuyerPropertyCard;
