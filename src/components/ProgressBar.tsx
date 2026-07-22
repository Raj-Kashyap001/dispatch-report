const ProgressBar = () => (
  <div style={{ margin: "1rem 0" }}>
    <div style={{ marginBottom: "0.35rem", fontWeight: "bold" }}>Parsing Data</div>
    <div
      style={{
        width: "100%",
        height: "10px",
        backgroundColor: "#e0e0e0",
        borderRadius: "5px",
        overflow: "hidden",
      }}
    >
      <div className="progress-bar-fill" />
    </div>
  </div>
);

export default ProgressBar;
