import { Loader, Trash2 } from "lucide-react";

const DeleteButton = ({ handleClick, isLoading }) => {
  return (
    <button
      className="w-full bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white py-3 px-6 rounded-xl font-semibold hover:from-red-600 hover:via-red-700 hover:to-red-800 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group/btn relative overflow-hidden"
      onClick={handleClick}
    >
      {isLoading ? (
        <Loader className="w-5 h-5 group-hover/btn:animate-pulse" />
      ) : (
        <Trash2 className="w-5 h-5 group-hover/btn:animate-pulse" />
      )}
      <span>Delete</span>
      {/* Button shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 rounded-xl" />
    </button>
  );
};

export default DeleteButton;
