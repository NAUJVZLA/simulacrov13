"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { InterfaceRegister } from "../controller/interface";
import { register } from "../controller/api";

const RegisterPage: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const dataRegister: InterfaceRegister = {
      name,
      email,
      password,
    };
    console.log("errorregister", dataRegister);

    const response = await fetch(register, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataRegister),
    });

    if (response.ok) {
      alert("Usuario creado");
      setName("");
      setEmail("");
      setPassword("");
      router.push("/login");
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="name"
        />
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
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="password"
        />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
};

export default RegisterPage;
