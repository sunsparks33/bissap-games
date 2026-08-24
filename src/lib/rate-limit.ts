import { NextResponse } from 'next/server';

interface RateLimitStore {
  [ip: string]: { count: number; resetTime: number };
}

const store: RateLimitStore = {};

// Clean up stale IP records every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const ip in store) {
    if (store[ip].resetTime < now) {
      delete store[ip];
    }
  }
}, 5 * 60 * 1000);

export function checkRateLimit(request: Request, limit = 30, windowMs = 60 * 1000): { success: boolean; remaining: number; reset: number } {
  // Extract client IP address or default fallback
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
             request.headers.get('x-real-ip') || 
             'anonymous-client';

  const now = Date.now();
  const record = store[ip];

  if (!record || record.resetTime < now) {
    store[ip] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return { success: true, remaining: limit - 1, reset: store[ip].resetTime };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0, reset: record.resetTime };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count, reset: record.resetTime };
}

export function rateLimitResponse(reset: number) {
  const retryAfter = Math.ceil((reset - Date.now()) / 1000);
  return NextResponse.json(
    { error: 'Too many requests. Please try again later.' },
    { 
      status: 429, 
      headers: {
        'Retry-After': String(retryAfter > 0 ? retryAfter : 1),
        'X-RateLimit-Limit': '30',
        'X-RateLimit-Remaining': '0',
      } 
    }
  );
}
