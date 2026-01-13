// reportWebVitals.js
const reportWebVitals = (onPerfEntry) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
        // Dynamic import latest web-vitals
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(onPerfEntry);
            getFID(onPerfEntry);
            getFCP(onPerfEntry);
            getLCP(onPerfEntry);
            getTTFB(onPerfEntry);
        }).catch((error) => {
            console.error("Web Vitals failed to load:", error);
        });
    }
};

export default reportWebVitals;
