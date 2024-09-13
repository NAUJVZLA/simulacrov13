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
    <div className="container">
      <h1 className="formTitle">Register</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label className="formLabel" htmlFor="name">
          Name
        </label>
        <input
          className="formInput"
          type="text"
          name="name"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="name"
        />
        <label className="formLabel" htmlFor="email">
          Email
        </label>
        <input
          className="formInput"
          type="email"
          name="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="email"
        />
        <label className="formLabel" htmlFor="password">
          Password
        </label>
        <input
          className="formInput"
          type="password"
          name="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="password"
        />
        <button className="formButton" type="submit">
          Registrar
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
