import { Heart, MapPin, IndianRupee, Eye, Trash2 } from "lucide-react";
import DeleteButton from "../DeleteButton";

const AdminPropertyCard = ({
  propertyId,
  image,
  title,
  description,
  favorites,
  price,
  location,
  onDelete,
  isLoading,
}) => {
  const truncateDescription = (text, maxWords = 100) => {
    if (!text) return "";
    const words = text.split(" ");
    if (words.length <= maxWords) return text;
    return words.slice(0, maxWords).join(" ") + "...";
  };
  /* 
  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price}`;
  }; */

  const handleDelete = () => {
    if (onDelete) {
      onDelete(propertyId);
    }
  };

  return (
    <div className="relative group bg-gradient-to-br from-white via-white to-gray-50 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-6 m-2 border border-gray-100 hover:border-gray-200 transform hover:-translate-y-1">
      {/* Property Image */}
      <div className="relative mb-6">
        <div className="relative overflow-hidden rounded-xl">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {!image && (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <Eye className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>
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
            <p className="text-sm text-gray-900 truncate">{location.address}</p>
            <p className="text-sm text-gray-900 truncate">{location.city}</p>
            <p className="text-sm text-gray-900 truncate">{location.state}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
          <IndianRupee className="w-5 h-5 text-green-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">Price</p>
            <p className="text-lg font-nunito-bold text-green-600">₹{price}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
          <Heart className="w-5 h-5 text-red-500" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">Favorites</p>
            <p className="text-sm text-gray-900">{favorites} favorite</p>
          </div>
        </div>
      </div>

      {/* Action button */}

      <DeleteButton handleClick={handleDelete} isLoading={isLoading} />
    </div>
  );
};

export default AdminPropertyCard;
