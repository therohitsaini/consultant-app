import { Navigate } from 'react-router-dom';
import { useAppStatus } from '../ProtectRoute/AppStatusProvider';

const ProtectStoreFront = ({ children }) => {
    const { loading, appEnabled } = useAppStatus();

    // if (loading) return null; // or spinner

    if (!appEnabled) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    // background: "#f6f6f7",
                    padding: "20px",
                }}
            >
                <img
                    src={"./images/admin.png"}
                    alt="App Disabled"
                    style={{
                        maxWidth: "320px",
                        width: "100%",
                        marginBottom: "20px",
                    }}
                />

             
            </div>
        )

    }

    console.log("appEnabled", appEnabled);

    return children;
};

export default ProtectStoreFront;
