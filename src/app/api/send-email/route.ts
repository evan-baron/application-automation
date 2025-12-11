import { NextRequest, NextResponse } from 'next/server';
import { sendGmail } from '@/lib/gmail';

export async function POST(req: NextRequest) {
	try {
		const { to, subject, body } = await req.json();

		if (!to || !subject || !body) {
			return NextResponse.json(
				{ error: 'Missing parameters' },
				{ status: 400 }
			);
		}

		await sendGmail({ to, subject, html: body });

		return NextResponse.json({ success: true });
	} catch (error: any) {
		console.error('Email send error:', error);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
