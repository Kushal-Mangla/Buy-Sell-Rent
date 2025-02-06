import React from 'react';
import { useNavigate } from 'react-router-dom';

const CASLoginButton = () => {
  const handleCASLogin = async () => {
    window.location.href = `http://localhost:5000/api/user/cas/login`;
    
  };

  return (
    <button
      onClick={handleCASLogin}
      className="w-full flex items-center justify-center gap-2 bg-[#2c5282] hover:bg-[#2a4365] text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
    >
      <span>Login with IIIT Account</span>
    </button>
  );
};

export default CASLoginButton;