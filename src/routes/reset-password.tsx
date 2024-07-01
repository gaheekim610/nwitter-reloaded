import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from "firebase/app";

import {
	Error,
	Form,
	Input,
	Title,
	Wrapper,
} from "../components/auth-component";

export default function ResetPassword() {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [resetInfo, setResetInfo] = useState({
		email: "",
	});
	const [error, setError] = useState("");

	const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const {
			target: { name, value },
		} = e;
		setResetInfo({
			...resetInfo,
			[name]: value,
		});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");
		try {
			setIsLoading(true);
			await sendPasswordResetEmail(auth, resetInfo.email);
			navigate("/login");
		} catch (e) {
			if (e instanceof FirebaseError) {
				setError(e.message);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Wrapper>
			<Title>Reset Password</Title>
			<Form onSubmit={handleSubmit}>
				<Input
					onChange={handleChange}
					name="email"
					placeholder="Email"
					type="email"
					required
				/>
				{/* use 'disabled' attribute to prevent duplicate clicks while an api call is being made */}
				<Input
					type="submit"
					value={isLoading ? "Sending Email..." : "Reset Password"}
					disabled={isLoading}
				/>
			</Form>
			{error ? <Error>{error}</Error> : null}
		</Wrapper>
	);
}
