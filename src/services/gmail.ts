/**
 * Gmail API Client Service
 * Adheres to Workspace Integration least-privilege & user-confirmation requirements
 */

export interface EmailPayload {
  to: string;
  subject: string;
  messageHtml: string;
}

/**
 * Creates a base64url encoded RFC 2822 email message
 */
function createRawEmail(to: string, from: string, subject: string, messageHtml: string): string {
  const emailLines = [
    `To: ${to}`,
    `From: ${from}`,
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    messageHtml
  ];

  const rawMessage = emailLines.join('\r\n');
  return btoa(unescape(encodeURIComponent(rawMessage)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Sends an email using the Gmail REST API v1
 * Requires user confirmation prior to mutation
 */
export async function sendGmailMessage(
  accessToken: string,
  userEmail: string,
  payload: EmailPayload
): Promise<{ id: string; threadId: string }> {
  const raw = createRawEmail(payload.to, userEmail, payload.subject, payload.messageHtml);

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ raw })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Gmail API error (${response.status})`);
  }

  return response.json();
}

/**
 * Fetches the user's Gmail profile information
 */
export async function getGmailProfile(accessToken: string): Promise<{ emailAddress: string; messagesTotal: number }> {
  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/profile', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch Gmail profile');
  }

  return response.json();
}
