import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginForm.module.css';
import axios from 'axios';
import { requestFcmTokenInNewWindow } from '../../firebase/FcmToken';

const LoginForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [tokenStatus, setTokenStatus] = useState('');

    console.log("tokenStatus", tokenStatus)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();

    //     console.log("process.env.REACT_APP_BACKEND_HOST", process.env.REACT_APP_BACKEND_HOST)

    //     if (!validateForm()) {
    //         return;
    //     }
    //     const response = await axios.post(`${process.env.REACT_APP_BACKEND_HOST}/api-consultant/login-consultant`, formData);
    //     console.log("response_login_consultant", response.
    //         data.
    //         userData
    //     );
    //     if (response.status === 200) {
    //         localStorage.setItem('client_u_Identity', response.data.userData._id);
    //         navigate('/consultant-dashboard');
    //     } else {
    //         setErrors({ email: 'Invalid email or password' });
    //     }
    // };

    // Helper function to navigate to dashboard
    const proceedToDashboard = (shop, host) => {
        const targetShop = shop;
        const hostQuery = host ? `?host=${encodeURIComponent(host)}` : "";
        if (targetShop) {
            window.top.location.href = `https://${targetShop}/apps/consultant-theme/consultant-dashboard${hostQuery}`;
        } else {
            navigate('/consultant-dashboard');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_HOST}/api-consultant/login-consultant`,
                formData
            );

            const { userData, token } = response?.data;
            console.log("userData", userData);
            console.log("token", response?.data);

            // Ensure userData exists and has an _id
            if (response.status === 200 && response.data?.userData?._id) {
                const params = new URLSearchParams(window.location.search);
                const shop = params.get("shop");
                const host = params.get("host");
                const userId = userData?._id;
                const shopId = userData?.shop_id;
                localStorage.setItem("client_u_Identity", userId);
                localStorage.setItem("shop_o_Identity", shopId);
                localStorage.setItem("varify_tokem", token);

                // Generate FCM token in new tab/window
                setIsLoading(true);
                
                // Call FcmToken utility function
                const cleanup = requestFcmTokenInNewWindow(
                    userId,
                    shopId,
                    {
                        onStatusChange: (status) => {
                            setTokenStatus(status);
                        },
                        onSuccess: (data) => {
                            console.log("✅ Token saved successfully:", data);
                            setIsLoading(false);
                            proceedToDashboard(shop, host);
                        },
                        onError: (error) => {
                            console.error("❌ Token generation error:", error);
                            setIsLoading(false);
                            // Still proceed to dashboard even if token failed
                            proceedToDashboard(shop, host);
                        }
                    }
                );
                
                // Store cleanup function for component unmount (optional)
                // cleanup will be called automatically when callbacks are executed
            } else {
                setErrors({ email: "Invalid email or password" });
            }
        } catch (err) {
            console.error("login error", err);
            setErrors({ email: "Something went wrong. Please try again." });
        }
    };

    return (
        <div className={styles.loginPageContainer}>
            <div className={styles.loginContainer}>
                {/* Title */}
                <h1 className={styles.loginTitle}>Login</h1>

                {/* Login Form */}
                <form className={styles.loginForm} onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.formLabel}>
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={`${styles.formInput} ${errors.email ? styles.inputError : ''}`}
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                        />
                        {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                    </div>

                    {/* Password Field */}
                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.formLabel}>
                            Password
                        </label>
                        <div className={styles.passwordInputWrapper}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                className={`${styles.formInput} ${errors.password ? styles.inputError : ''}`}
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={() => setShowPassword(!showPassword)}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                        <line x1="1" y1="1" x2="23" y2="23" />
                                    </svg>
                                ) : (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
                    </div>

                    {/* Forgot Password Link */}
                    <div className={styles.forgotPasswordContainer}>
                        <a href="#" className={styles.forgotPassword} onClick={(e) => e.preventDefault()}>
                            Forgot your password?
                        </a>
                    </div>

                    {/* Token Status */}
                    {tokenStatus && (
                        <div style={{
                            padding: "10px",
                            marginBottom: "15px",
                            backgroundColor: "#e7f3ff",
                            borderRadius: "5px",
                            textAlign: "center",
                            fontSize: "14px",
                            color: "#0066cc"
                        }}>
                            {tokenStatus}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className={`${styles.submitButton} ${isLoading ? styles.buttonLoading : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <svg className={styles.spinner} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="12" y1="2" x2="12" y2="6" />
                                    <line x1="12" y1="18" x2="12" y2="22" />
                                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                                    <line x1="2" y1="12" x2="6" y2="12" />
                                    <line x1="18" y1="12" x2="22" y2="12" />
                                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                                </svg>
                                {tokenStatus || "Signing in..."}
                            </>
                        ) : (
                            'Log in'
                        )}
                    </button>

                    {/* Create Account Link */}
                    <div className={styles.createAccountLink}>
                        <a href="#" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>
                            Create account
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;

