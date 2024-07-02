import { useEffect, useState } from "react";

import { db } from "../firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

import styled from "styled-components";
import Tweet from "./tweet";

export interface ITweet {
	id: string;
	photo?: string;
	tweet: string;
	userId: string;
	username: string;
	createdAt: number;
}

const Wrapper = styled.div``;

export default function Timeline() {
	const [tweets, setTweets] = useState<ITweet[]>([]);
	const fetchTweets = async () => {
		const tweetsQuery = query(
			collection(db, "tweets"),
			orderBy("createdAt", "desc"),
		);
		const snapshot = await getDocs(tweetsQuery);

		console.log("snapshot", snapshot);
		const tweetArr = snapshot.docs.map((doc) => {
			const { tweet, createdAt, userId, username, photo } = doc.data();

			return {
				id: doc.id,
				photo,
				tweet,
				userId,
				createdAt,
				username,
			};
		});
		setTweets(tweetArr);
	};
	useEffect(() => {
		fetchTweets();
	}, []);

	return (
		<Wrapper>
			{tweets.map((tweet) => (
				<Tweet key={tweet.id} {...tweet} />
			))}
		</Wrapper>
	);
}
