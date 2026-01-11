// const reportWebVitals = onPerfEntry => {
//   if (onPerfEntry && onPerfEntry instanceof Function) {
//     import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, getCLS, getFID, getFCP, getLCP, getTTFB }) => {
//       // Try v3 API first (onCLS, onFID, etc.)
//       if (typeof onCLS === 'function') {
//         onCLS(onPerfEntry);
//         onFID(onPerfEntry);
//         onFCP(onPerfEntry);
//         onLCP(onPerfEntry);
//         onTTFB(onPerfEntry);
//       } 
//       // Fallback to v2 API (getCLS, getFID, etc.)
//       else if (typeof getCLS === 'function') {
//         getCLS(onPerfEntry);
//         getFID(onPerfEntry);
//         getFCP(onPerfEntry);
//         getLCP(onPerfEntry);
//         getTTFB(onPerfEntry);
//       }
//     }).catch(() => {
//       // Silently fail if web-vitals is not available or causes conflicts
//       // This prevents App Bridge initialization errors
//     });
//   }
// };

// export default reportWebVitals;
