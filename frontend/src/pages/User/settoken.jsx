import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SET_TOKEN_SUCCESS, SET_TOKEN_FAIL, auth } from '../../store/Auth_Slice';
import { authenticateByEmail } from '../../store/Auth_Slice';
const TokenService = {

    setToken: (token) => {
        document.cookie = `token=${token}; path=/; samesite=lax; secure=false; httponly=true`;

        try {
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const userData = {
                email: decodedToken.email,
                role: decodedToken.role,
                id: decodedToken.id,
                age: decodedToken.age,
                fname: decodedToken.fname,
                lname: decodedToken.lname,
                phone: decodedToken.phone,
            };
            localStorage.setItem('user', JSON.stringify(userData));
            return {
                success: true,
                message: "Token set successfully",
                user: userData
            };
        } catch (error) {
            console.error('Error setting token:', error);
            return {
                success: false,
                message: "Failed to set token"
            };
        }
    },

    getToken: () => {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
        return tokenCookie ? tokenCookie.split('=')[1] : null;
    },

    removeToken: () => {
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        localStorage.removeItem('user');
    }
};

const TokenHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');

        if (token) {
            const result = TokenService.setToken(token);
            console.log("result", result);
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const EMAIL = decodedToken.email;
            if (result.success) {
                dispatch(SET_TOKEN_SUCCESS(result));
                console.log("result", result);
                // update the user present in my redux store
                console.log("CAS EMAIL", EMAIL);
                dispatch(authenticateByEmail(EMAIL)).then((response) =>
                {
                    console.log("cas response",response);
                });
                navigate('/shopping-home/profile');
            } else {
                dispatch(SET_TOKEN_FAIL({
                    success: false,
                    message: "Failed to set token"
                }));
                navigate('user/login');
            }
        } else {
            navigate('/login');
        }
    }, [location, navigate, dispatch]);

    return null;
};

export default TokenHandler;