import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { FirebaseError } from "firebase/app";

import {
	Error,
	Form,
	Input,
	Switcher,
	Title,
	Wrapper,
} from "../components/auth-component";
import GithubButton from "../components/github-btn";

export default function CreateAccount() {
	const navigate = useNavigate();
	const [isLoading, setLoading] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const {
			target: { name, value },
		} = e;
		if (name === "name") {
			setName(value);
		} else if (name === "email") {
			setEmail(value);
		} else if (name === "password") {
			setPassword(value);
		}
	};
	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");

		if (isLoading || name === "" || email === "" || password === "") return;
		try {
			setLoading(true);
			// create an account
			// TODO: create email verification
			const credentials = await createUserWithEmailAndPassword(
				auth,
				email,
				password,
			);
			// set the name of the user
			await updateProfile(credentials.user, {
				displayName: name,
			});
			// redirect to the home page
			navigate("/");
		} catch (e) {
			if (e instanceof FirebaseError) {
				setError(e.message);
			}
		} finally {
			setLoading(false);
		}
	};

	return (
		<Wrapper>
			<Title> Join X </Title>
			<Form onSubmit={onSubmit}>
				<Input
					onChange={onChange}
					name="name"
					placeholder="Name"
					type="text"
					required
				/>
				<Input
					onChange={onChange}
					name="email"
					placeholder="Email"
					type="email"
					required
				/>
				<Input
					onChange={onChange}
					name="password"
					placeholder="Password"
					type="password"
				/>
				<Input
					type="submit"
					value={isLoading ? "Loading..." : "Create Account"}
				/>
			</Form>
			{error !== "" ? <Error>{error}</Error> : null}
			<Switcher>
				Already have an account? <Link to="/login">Log in</Link>
			</Switcher>
			<Switcher>
				Forget your password?{" "}
				<Link to="/reset-password">Reset your password</Link>
			</Switcher>
			<GithubButton />
		</Wrapper>
	);
}
