import { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

const vapidKey = "BB8E-fAs8w3xZZ3cL_R3jjnTHaNDu4LGcra1NJhX60UG0lxvzBHVzzblrvv7cm6FMaGo_o_r2hbiB1eibrtg1h0";

export default function FcmToken() {
    const [status, setStatus] = useState("Generating FCM token...");
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Function to generate FCM token
        async function generateFcmToken() {
            try {
                // Step 1: Get FCM token
                setStatus("Generating FCM token...");
                console.log("🔑 Generating FCM token with VAPID key...");
                
                const currentToken = await getToken(messaging, { vapidKey });
                
                if (!currentToken) {
                    const errorMsg = "No FCM token available. Please check Firebase configuration.";
                    setError(errorMsg);
                    setStatus("Token generation failed");
                    console.error("❌", errorMsg);
                    
                    if (window.opener) {
                        window.opener.postMessage({
                            type: "FCM_TOKEN_ERROR",
                            error: errorMsg
                        }, window.location.origin);
                    }
                    return;
                }

                // Step 2: Token generated successfully
                setToken(currentToken);
                setStatus("Token generated successfully!");
                console.log("✅ ========================================");
                console.log("✅ FCM TOKEN GENERATED SUCCESSFULLY!");
                console.log("✅ ========================================");
                console.log("📱 FCM TOKEN:", currentToken);
                console.log("✅ ========================================");
                console.log("📋 Token Length:", currentToken.length);
                console.log("✅ ========================================");

                // Get userId from localStorage or URL params
                const userId = localStorage.getItem("client_u_Identity") || 
                              new URLSearchParams(window.location.search).get("userId");
                
                if (userId) {
                    // Step 3: Save token to backend
                    setStatus("Saving token to backend...");
                    console.log("💾 Saving token to backend for userId:", userId);
                    
                    const backendHost = process.env.REACT_APP_BACKEND_HOST || "http://localhost:5001";
                    try {
                        const response = await fetch(`${backendHost}/api/save-fcm-token`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ userId, token: currentToken }),
                        });

                        if (response.ok) {
                            const data = await response.json();
                            console.log("✅ Token saved to backend successfully:", data);
                            setStatus("Token saved successfully!");
                        } else {
                            console.warn("⚠️ Failed to save token to backend:", response.statusText);
                            setStatus("Token generated but save failed");
                        }
                    } catch (apiError) {
                        console.error("❌ Error saving token to backend:", apiError);
                        setStatus("Token generated but save failed");
                    }
                } else {
                    console.warn("⚠️ No userId found. Token generated but not saved.");
                }

                // Step 4: Send token to parent window
                if (window.opener) {
                    window.opener.postMessage({
                        type: "FCM_TOKEN_SUCCESS",
                        token: currentToken,
                        userId: userId
                    }, window.location.origin);
                    console.log("📤 Token sent to parent window");
                }

                // Step 5: Setup foreground message listener
                const unsubOnMessage = onMessage(messaging, (payload) => {
                    console.log("📨 Foreground message received:", payload);
                    
                    if (window.opener && payload.notification) {
                        window.opener.postMessage({
                            type: "FCM_NOTIFICATION",
                            title: payload.notification.title || "New Notification",
                            body: payload.notification.body || "",
                            icon: payload.notification.icon,
                            data: payload.data || {}
                        }, window.location.origin);
                    }
                });

                // Auto close after 3 seconds
                setTimeout(() => {
                    console.log("🔒 Closing window in 3 seconds...");
                    if (window.opener) {
                        window.close();
                    }
                }, 3000);

                return () => {
                    if (typeof unsubOnMessage === "function") {
                        unsubOnMessage();
                    }
                };

            } catch (err) {
                const errorMsg = `FCM token generation failed: ${err.message}`;
                setError(errorMsg);
                setStatus("Error occurred");
                console.error("❌ FCM TOKEN ERROR:", err);
                console.error("❌ Error details:", {
                    message: err.message,
                    code: err.code,
                    stack: err.stack
                });

                if (window.opener) {
                    window.opener.postMessage({
                        type: "FCM_TOKEN_ERROR",
                        error: errorMsg
                    }, window.location.origin);
                }
            }
        }

        // Generate FCM token directly
        generateFcmToken();
    }, []);

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            padding: "20px",
            fontFamily: "Arial, sans-serif",
            backgroundColor: "#f5f5f5"
        }}>
            <div style={{
                backgroundColor: "white",
                padding: "30px",
                borderRadius: "10px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                maxWidth: "500px",
                width: "100%",
                textAlign: "center"
            }}>
                <h2 style={{ color: "#333", marginBottom: "20px" }}>
                    🔔 FCM Token Generation
                </h2>
                
                {token ? (
                    <>
                        <div style={{
                            backgroundColor: "#d4edda",
                            border: "1px solid #c3e6cb",
                            borderRadius: "5px",
                            padding: "15px",
                            marginBottom: "20px"
                        }}>
                            <p style={{ color: "#155724", margin: 0, fontWeight: "bold" }}>
                                ✅ Token Generated Successfully!
                            </p>
                        </div>
                        <div style={{
                            backgroundColor: "#f8f9fa",
                            border: "1px solid #dee2e6",
                            borderRadius: "5px",
                            padding: "15px",
                            marginBottom: "20px",
                            wordBreak: "break-all"
                        }}>
                            <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "#333" }}>
                                Your FCM Token:
                            </p>
                            <code style={{
                                color: "#0066cc",
                                fontSize: "12px",
                                display: "block",
                                textAlign: "left"
                            }}>
                                {token}
                            </code>
                        </div>
                        <p style={{ color: "#666", fontSize: "14px" }}>
                            Check browser console for detailed logs.
                            <br />
                            This window will close automatically...
                        </p>
                    </>
                ) : error ? (
                    <>
                        <div style={{
                            backgroundColor: "#f8d7da",
                            border: "1px solid #f5c6cb",
                            borderRadius: "5px",
                            padding: "15px",
                            marginBottom: "20px"
                        }}>
                            <p style={{ color: "#721c24", margin: 0, fontWeight: "bold" }}>
                                ❌ {error}
                            </p>
                        </div>
                        <p style={{ color: "#666", fontSize: "14px" }}>
                            Please check the console for more details.
                        </p>
                    </>
                ) : (
                    <>
                        <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            marginBottom: "20px"
                        }}>
                            <div style={{
                                width: "40px",
                                height: "40px",
                                border: "4px solid #f3f3f3",
                                borderTop: "4px solid #3498db",
                                borderRadius: "50%",
                                animation: "spin 1s linear infinite"
                            }}></div>
                        </div>
                        <p style={{ color: "#666" }}>{status}</p>
                        <style>{`
                            @keyframes spin {
                                0% { transform: rotate(0deg); }
                                100% { transform: rotate(360deg); }
                            }
                        `}</style>
                    </>
                )}
            </div>
        </div>
    );
}
