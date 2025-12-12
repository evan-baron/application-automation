'use client';

// Library imports
import React, { useState } from 'react';

const TestButton = () => {
	const [sending, setSending] = useState(false);
	const [message, setMessage] = useState('');

	const handleClick = async () => {
		setSending(true);

		try {
			const response = await fetch('/api/send-email', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					to: 'egbaron@gmail.com',
					subject: 'Test Email from Application',
					body:
						message ||
						'This is a test email from the application automation system.',
				}),
			});

			const result = await response.json();

			if (response.ok) {
				alert('Email sent successfully!');
				setMessage(''); // Clear the message after successful send
			} else {
				alert(`Failed to send email: ${result.error || 'Unknown error'}`);
			}
		} catch (error) {
			console.error('Error sending email:', error);
			alert('Error sending email. Check console for details.');
		} finally {
			setSending(false);
		}
	};

	return (
		<div>
			<input
				type='text'
				placeholder='Enter your test message'
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				style={{ marginRight: '10px', padding: '5px' }}
			/>
			<button onClick={handleClick} disabled={sending}>
				{sending ? 'Sending...' : 'Send Test Email'}
			</button>
		</div>
	);
};

export default TestButton;
