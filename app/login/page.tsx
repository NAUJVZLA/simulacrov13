"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "../controller/api";
import { InterfaceLogin } from "../controller/interface";
import Link from "next/link";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const dataLogin: InterfaceLogin = { email, password };
    const response: Response = await fetch(login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataLogin),
    });
    if (response.ok) {
      const data = await response.json();
      alert("Inicio de Sesión");
      sessionStorage.setItem("token", data.token);
      const token = sessionStorage.getItem("token");
      if (token) {
        router.push("/post");
      } else {
        alert("No estas autenticado");
      }
    } else {
      if (confirm("Datos no existentes , \n\n Registrate")) {
        router.push("/register");
      }
    }

    setEmail("");
    setPassword("");
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="email"
        />
        <label htmlFor="password">password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="password"
        />
        <button type="submit"> Iniciar Sesión</button>
      </form>
      <Link href="/register">
        <h3>Si aun no tienes cuenta registrate</h3>
      </Link>
    </div>
  );
};

export default LoginPage;
