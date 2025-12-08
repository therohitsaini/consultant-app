import { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import { checkAndRequestNotificationPermission } from "./utils/notificationPermission";

const vapidKey = "BB8E-fAs8w3xZZ3cL_R3jjnTHaNDu4LGcra1NJhX60UG0lxvzBHVzzblrvv7cm6FMaGo_o_r2hbiB1eibrtg1h0";

export default function FcmToken() {
    const [status, setStatus] = useState("Checking notification permission...");
    const [token, setToken] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Function to generate FCM token (called after permission is granted)
        async function generateFcmToken() {
            try {
                // Step 2: Get FCM token
                setStatus("Generating FCM token...");
                console.log("🔑 Step 2: Generating FCM token with VAPID key...");
                
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

                // Step 3: Token generated successfully
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
                    // Step 4: Save token to backend
                    setStatus("Saving token to backend...");
                    console.log("💾 Step 3: Saving token to backend for userId:", userId);
                    
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

                // Step 5: Send token to parent window
                if (window.opener) {
                    window.opener.postMessage({
                        type: "FCM_TOKEN_SUCCESS",
                        token: currentToken,
                        userId: userId
                    }, window.location.origin);
                    console.log("📤 Token sent to parent window");
                }

                // Step 6: Setup foreground message listener
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

        // Step 1: Check and request notification permission
        async function initFcmToken() {
            setStatus("Checking notification permission...");
            console.log("🔔 Step 1: Checking notification permission...");
            console.log("📋 Current permission status:", Notification.permission);
            
            const permissionGranted = await checkAndRequestNotificationPermission(() => {
                // Callback: Permission granted, now generate FCM token
                console.log("✅ Permission granted! Generating FCM token...");
                generateFcmToken();
            });

            if (!permissionGranted) {
                let errorMsg = "";
                if (Notification.permission === "denied") {
                    errorMsg = "Notification permission denied. Please allow notifications in browser settings (click the lock icon in address bar).";
                } else {
                    errorMsg = "Notification permission not granted. Please allow notifications to continue.";
                }
                
                setError(errorMsg);
                setStatus("Permission denied");
                console.error("❌", errorMsg);
                console.log("💡 Current permission:", Notification.permission);
                console.log("💡 To enable: Click lock icon (🔒) in address bar → Notifications → Allow");
                
                // Send error to parent window
                if (window.opener) {
                    window.opener.postMessage({
                        type: "FCM_TOKEN_ERROR",
                        error: errorMsg,
                        permission: Notification.permission
                    }, window.location.origin);
                }
            }
        }

        initFcmToken();
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
                        
                        <div style={{
                            backgroundColor: "#fff3cd",
                            border: "1px solid #ffc107",
                            borderRadius: "5px",
                            padding: "15px",
                            marginBottom: "20px",
                            textAlign: "left"
                        }}>
                            <p style={{ margin: "0 0 10px 0", fontWeight: "bold", color: "#856404" }}>
                                📋 How to Enable Notifications:
                            </p>
                            <ol style={{ margin: "0", paddingLeft: "20px", color: "#856404", fontSize: "14px" }}>
                                <li>Click the <strong>lock icon (🔒)</strong> or <strong>info icon (i)</strong> in your browser's address bar</li>
                                <li>Find <strong>"Notifications"</strong> in the permissions list</li>
                                <li>Change it to <strong>"Allow"</strong></li>
                                <li>Refresh this page or click the button below</li>
                            </ol>
                        </div>
                        
                        <button
                            onClick={() => {
                                // Retry permission request
                                window.location.reload();
                            }}
                            style={{
                                backgroundColor: "#007bff",
                                color: "white",
                                border: "none",
                                borderRadius: "5px",
                                padding: "10px 20px",
                                fontSize: "16px",
                                cursor: "pointer",
                                fontWeight: "bold",
                                marginTop: "10px"
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = "#0056b3"}
                            onMouseOut={(e) => e.target.style.backgroundColor = "#007bff"}
                        >
                            🔄 Retry After Enabling Notifications
                        </button>
                        
                        <p style={{ color: "#666", fontSize: "14px", marginTop: "15px" }}>
                            After enabling notifications, click the button above to retry.
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
