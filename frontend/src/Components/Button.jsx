const Button = (props) => {
  return (
    <button
      onClick={props.handleOnClick}
      disabled={props.isDisabled}
      className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white py-4 px-6 rounded-xl font-nunito-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transform hover:scale-105 transition-all duration-300 mb-4 relative overflow-hidden"
    >
      {props.isVerifying ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-white/30 bg-pink-600 border-t-white rounded-full animate-spin mr-2"></div>
          {props.textDisabled}
        </div>
      ) : (
        props.text
      )}
    </button>
  );
};

export default Button;
