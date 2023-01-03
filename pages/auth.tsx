import useLogout from "hooks/useLogout";
import useSignup from "hooks/useRegister";
import Link from "next/link";
import { useEffect, useState } from "react";
import useLogin from "hooks/useLogin";
import { useAppStore } from "store";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [auth, setAuth] = useState(false);

  const { onLogin } = useLogin();
  const { onSignup } = useSignup();
  const { onLogout } = useLogout();

  const store = useAppStore();

  useEffect(() => {
    if (store.accessToken) {
      setAuth(true);
    } else {
      setAuth(false);
    }
  }, [store.accessToken]);

  return (
    <div>
      {auth === true ? (
        <div>
          <Link href="/protected"> protected page</Link>
          <button onClick={() => onLogout()}>Logout</button>
        </div>
      ) : (
        <div className="margin">
          <div className="margin">
            <h1>Register</h1>
            <input
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
            ></input>
            <input
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              type="password"
            ></input>
            <button onClick={() => onSignup({ email, password })}>
              SignUp
            </button>
          </div>
          <div className="margin">
            <h1>Login</h1>
            <input
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="Email"
            ></input>
            <input
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Password"
              type="password"
            ></input>
            <button
              onClick={() =>
                onLogin({ email: loginEmail, password: loginPassword })
              }
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
