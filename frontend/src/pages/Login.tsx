function Login() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        flexDirection: "column",
      }}
    >
      <h1>Task Manager</h1>

      <h2>Login Page</h2>

      <input
        type="email"
        placeholder="Enter Email"
        style={{ padding: "10px", margin: "10px", width: "250px" }}
      />

      <input
        type="password"
        placeholder="Enter Password"
        style={{ padding: "10px", margin: "10px", width: "250px" }}
      />

      <button
        style={{
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Login
      </button>
    </div>
  );
}

export default Login;