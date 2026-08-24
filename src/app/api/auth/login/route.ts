import { NextResponse } from 'next/server';
import { checkRateLimit, rateLimitResponse } from '@/lib/rate-limit';
import crypto from 'crypto';

export async function POST(request: Request) {
  // 1. Strict rate limiting: max 5 login attempts per minute per IP
  const rl = checkRateLimit(request, 5, 60000);
  if (!rl.success) {
    return rateLimitResponse(rl.reset);
  }

  try {
    const { passcode } = await request.json();

    if (!passcode || typeof passcode !== 'string') {
      return NextResponse.json({ error: 'Passcode is required' }, { status: 400 });
    }

    const expectedPasscode = process.env.ADMIN_PASSCODE || 'Redaaa@1234@';

    // 2. Timing-safe comparison to prevent timing attacks
    const bufferProvided = Buffer.from(passcode);
    const bufferExpected = Buffer.from(expectedPasscode);

    let isMatch = false;
    if (bufferProvided.length === bufferExpected.length) {
      isMatch = crypto.timingSafeEqual(bufferProvided, bufferExpected);
    }

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid security passcode. Access denied.' }, { status: 401 });
    }

    // 3. Generate a secure session auth token
    const token = crypto.createHash('sha256').update(`${expectedPasscode}_authenticated_session`).digest('hex');

    return NextResponse.json({
      success: true,
      message: 'Admin authentication successful',
      token,
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error during authentication:', error);
    return NextResponse.json({ error: 'Authentication failed due to server error' }, { status: 500 });
  }
}
