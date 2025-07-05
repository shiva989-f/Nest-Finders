import { Loader } from "lucide-react";

const SubmitButton = (props) => {
  return (
    <button
      type="button"
      onClick={props.handleOnClick}
      disabled={props.isLoading}
      className={`w-full text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 shadow-lg flex justify-center items-center ${
        props.isLoading
          ? "bg-gray-500"
          : "bg-gray-800 hover:bg-gray-900 transform hover:scale-105"
      }`}
    >
      {props.isLoading ? <Loader className="animate-spin" /> : props.text}
    </button>
  );
};

export default SubmitButton;
