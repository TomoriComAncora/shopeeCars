import {RegisterOptions, UseFormRegister} from "react-hook-form"
import { FloatingLabel } from "flowbite-react";

interface InputProps {
  type: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
}

export function Input({ type, placeholder, name, register, rules, error }: InputProps) {
    return (
      <div >
        <FloatingLabel variant="standard" label=""
          type={type}
          placeholder={placeholder}
          {...register(name, rules)}
          id={name}
          required/>
        {error && <p className="my-1 text-red-500">{error}</p>}
      </div>
    );
  }