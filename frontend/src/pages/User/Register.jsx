import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { RegisterInfo } from "../../form_create";
import CommonForm from "../../pages/Additional/Form";
import { registerUser } from "../../store/Auth_Slice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/ui/use-toast";

const initialState = {
    fname: "",
    lname: "",
    email: "",
    password: "",
    confirmPassword: "",
};

function Register() {
    const [formData, setFormData] = useState(initialState);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();

    function onSubmit(e) {
        console.log("Submitted");
        console.log(formData);
        e.preventDefault();
        dispatch(registerUser(formData)).then((data) => {
            if(data?.payload?.success){
                toast({
                    title: data?.payload?.message,
                });
                navigate("/user/login");
            } else {
                toast({
                    title: data?.payload?.message,
                    variant: "destructive"
                });
            }
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="w-full max-w-lg mx-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10 space-y-8 border border-gray-100">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                            Create New Account
                        </h1>
                        <div className="h-1 w-16 bg-blue-500 mx-auto rounded-full"></div>
                        <p className="text-lg text-gray-600">
                            Already have an account?{" "}
                            <Link 
                                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 underline-offset-2 hover:underline"
                                to="/user/login"
                            >
                                Login here
                            </Link>
                        </p>
                    </div>
                    
                    <div className="mt-10">
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                            <CommonForm 
                                formControls={RegisterInfo}
                                buttonText={"Create Account"}
                                formData={formData}
                                setFormData={setFormData}
                                onSubmit={onSubmit}
                                className="space-y-6"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 text-center text-sm text-gray-500">
                    By creating an account, you agree to our{" "}
                    <Link to="/terms" className="text-blue-600 hover:text-blue-700 font-medium">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-blue-600 hover:text-blue-700 font-medium">
                        Privacy Policy
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Register;