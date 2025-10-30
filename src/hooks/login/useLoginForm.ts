import type { FormEvent } from "react";
import { useState } from "react";
import { useLogin } from "./useLogin";
import type { LoginResponse } from "@/types";

export function useLoginForm() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const { login, isLoading, error } = useLogin()

    const handleSubmit = async (e: FormEvent): Promise<LoginResponse | undefined> => {
        e.preventDefault()

        try {
            const result = await login({ username, password })
            return result
        } catch (err) {
            throw err
        }
    }

    const resetForm = () => {
        setUsername('')
        setPassword('')
    }

    return {
        username,
        setUsername,
        password,
        setPassword,
        handleSubmit,
        resetForm,
        isLoading,
        error
    }

}