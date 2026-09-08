'use client';

import { useState, FormEvent } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EmailSignupForm({
  source,
  buttonLabel = 'Sign Up',
  placeholder = 'you@example.com',
}: {
  // Identifies which page/feature this signup came from (e.g. "donate_referral").
  // Gets stored alongside the email so you can tell your different forms apart later.
  source: string;
  buttonLabel?: string;
  placeholder?: string;
}) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!EMAIL_REGEX.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setStatus('submitting');

    try {
      const res = await fetch('/api/email-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), source }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Something went wrong. Please try again.');
        setStatus('idle');
        return;
      }

      setStatus('success');
      setEmail('');
    } catch {
      setError('Network error. Please try again.');
      setStatus('idle');
    }
  }

  if (status === 'success') {
    return (
      <p className="text-center text-green-700 font-medium max-w-md mx-auto">
        Thanks — you&apos;re on the list. We&apos;ll be in touch.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-2 rounded whitespace-nowrap"
        >
          {status === 'submitting' ? 'Submitting…' : buttonLabel}
        </button>
      </div>
      {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
    </form>
  );
}
