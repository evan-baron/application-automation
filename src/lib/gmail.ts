import { google } from 'googleapis';
import nodemailer from 'nodemailer';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI!;
const REFRESH_TOKEN = process.env.GOOGLE_REFRESH_TOKEN!;
const SENDER_EMAIL = process.env.EMAIL_ADDRESS!;

const oAuth2Client = new google.auth.OAuth2(
	CLIENT_ID,
	CLIENT_SECRET,
	REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

export async function sendGmail({
	to,
	subject,
	text,
	html,
}: {
	to: string;
	subject: string;
	text?: string;
	html?: string;
}) {
	try {
		const accessTokenObject = await oAuth2Client.getAccessToken();
		const accessToken = accessTokenObject?.token;
		if (!accessToken) throw new Error('Failed to generate access token');

		const transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				type: 'OAuth2',
				user: SENDER_EMAIL,
				clientId: CLIENT_ID,
				clientSecret: CLIENT_SECRET,
				refreshToken: REFRESH_TOKEN,
				accessToken: accessToken,
			},
		});

		return transporter.sendMail({
			from: SENDER_EMAIL,
			to,
			subject,
			text,
			html,
		});
	} catch (error) {
		return error;
	}
}
