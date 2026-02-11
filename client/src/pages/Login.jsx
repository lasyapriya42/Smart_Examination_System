import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [result, setResult] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    setResult({
      message: "Frontend-only mode",
      user: { email, role }
    });
  };

  return (
    <section className="card">
      <h2>Login</h2>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>
        <label>
          Role
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="admin">Admin</option>
            <option value="hod">HOD</option>
            <option value="student">Student</option>
          </select>
        </label>
        <button type="submit">Sign In</button>
      </form>
      {result && (
        <pre>{JSON.stringify(result, null, 2)}</pre>
      )}
    </section>
  );
}
