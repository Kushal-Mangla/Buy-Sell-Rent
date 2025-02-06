import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LoginInfo } from "../../form_create";
import CommonForm from "../../pages/Additional/Form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/Auth_Slice";
import { useToast } from "../../components/ui/use-toast";
import { KeyRound } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import { useSelector } from "react-redux";
import { verifyRecaptcha } from "../../store/Auth_Slice";
import CASLoginButton from "./CasLoginButton";
const initialState = {
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
};

function Login() {
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [errorfound, setError] = useState("");
    const { recaptchaVerified, error } = useSelector((state) => state.auth);
    const handleRecaptcha = (token) => {
        dispatch(verifyRecaptcha(token));
        setError(""); // Clear any previous errors
    };

    function onSubmit(e) {
        e.preventDefault();

        if (!recaptchaVerified) {
            setError("Please complete the reCAPTCHA verification.");
            return;
        }

        dispatch(loginUser(formData)).then((response) => {
            if(response?.payload?.success) {
                toast({
                    title: response?.payload?.message,
                    type: "success",
                });
            } else {
                toast({
                    title: response?.payload?.message,
                    type: "error",
                });
            }
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="w-full max-w-md p-6">
                {/* Card Container */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-6">
                            <div className="p-2 bg-blue-50 rounded-full">
                                <KeyRound className="h-6 w-6 text-blue-600" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Welcome back
                        </h1>
                        <p className="text-gray-600">
                            Please enter your details to sign in
                        </p>
                    </div>

                    {/* Form Section */}
                    <div className="space-y-6">
                        <CommonForm 
                            formControls={LoginInfo}
                            buttonText={"Sign In"}
                            formData={formData}
                            setFormData={setFormData}
                            onSubmit={onSubmit}
                        />
                    </div>
                    <ReCAPTCHA sitekey="6Lc_-MwqAAAAADbjI7gxZOGRJdNcEp8h93Ki1CA2" onChange={handleRecaptcha} />
                    {errorfound && <p style={{ color: "red" }}>{errorfound}</p>}

                    {/* Additional Links */}
                    <div className="mt-8 space-y-4">
                        <div className="flex items-center justify-center">
                            <Link 
                                to="/forgot-password"
                                className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200"
                            >
                                Forgot your password?
                            </Link>
                        </div>
                        <CASLoginButton />
                        <div className="text-center">
                            <p className="text-gray-600 text-sm">
                                Don't have an account?{" "}
                                <Link 
                                    to="/user/register"
                                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <p className="text-center text-xs text-gray-500">
                            By continuing, you agree to our{" "}
                            <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
                            {" "}and{" "}
                            <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;