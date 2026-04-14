import React from "react";

const BlankModalSetupGuide = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        
        {/* Close Button */}
        <button style={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        {/* Blank Content Area */}
        <div style={styles.content}></div>

      </div>
    </div>
  );
};

export default BlankModalSetupGuide;

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modal: {
    position: "relative",
    width: "300px",
    height: "200px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },
  closeBtn: {
    position: "absolute",
    top: "10px",
    right: "10px",
    border: "none",
    background: "transparent",
    fontSize: "18px",
    cursor: "pointer",
  },
  content: {
    width: "100%",
    height: "100%",
  },
};