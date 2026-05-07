import Context from './Context';
import CryptoJS from 'crypto-js';

import cookies from 'js-cookie';

import { useEffect, useState } from 'react';
import { requestAuth } from '../config/UserRequest';
import { ToastContainer } from 'react-toastify';
import { requestGetCart } from '../config/CartRequest';

export function Provider({ children }) {
    const [dataUser, setDataUser] = useState({});
    const [cart, setCart] = useState([]);

    const fetchAuth = async () => {
        try {
            const res = await requestAuth();

            const bytes = CryptoJS.AES.decrypt(res.metadata, import.meta.env.VITE_SECRET_CRYPTO);
            const originalText = bytes.toString(CryptoJS.enc.Utf8);
            if (!originalText) {
                console.error('Failed to decrypt data');
                return;
            }
            const user = JSON.parse(originalText);
            setDataUser(user);
        } catch (error) {
            console.error('Auth error:', error);
        }
    };

    const fetchCart = async () => {
        try {
            const res = await requestGetCart();
            setCart(res.metadata.cart);
        } catch (error) {
            console.log(error);
        }
    };

    // Function to refresh user data (can be called after login)
    const refreshUserData = () => {
        const loggedCookie = cookies.get('logged');
        const hasToken = !!(localStorage.getItem('token') || cookies.get('token'));
        
        if (loggedCookie === '1' && hasToken) {
            fetchAuth();
            fetchCart();
        }
    };

    useEffect(() => {
        const loggedCookie = cookies.get('logged');
        const hasToken = !!(localStorage.getItem('token') || cookies.get('token'));
        
        console.log('[Provider] Checking auth state:', { loggedCookie, hasToken });

        // Only fetch auth data if user is logged in AND has a token
        if (loggedCookie === '1' && hasToken) {
            console.log('[Provider] User authenticated, fetching user data...');
            fetchAuth();
            fetchCart();
        } else {
            console.log('[Provider] User not properly authenticated, skipping data fetch');
        }
    }, []);

    return (
        <>
            <Context.Provider
                value={{
                    dataUser,
                    setDataUser,
                    cart,
                    setCart,
                    fetchCart,
                    refreshUserData,
                }}
            >
                {children}
                <ToastContainer />
            </Context.Provider>
        </>
    );
}
