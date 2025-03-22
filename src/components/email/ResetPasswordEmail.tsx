import * as React from 'react';

interface ResetPasswordEmailProps {
  token: string;
}

export const ResetPasswordEmail: React.FC<Readonly<ResetPasswordEmailProps>> = ({
  token,
}) => (
  <div style={{
    fontFamily: 'Arial, sans-serif',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
  }}>
    <h1 style={{
      color: '#333',
      fontSize: '24px',
      marginBottom: '20px',
    }}>Reset Your Password</h1>
    <p style={{
      color: '#666',
      fontSize: '16px',
      lineHeight: '1.5',
      marginBottom: '20px',
    }}>Click the link below to reset your password:</p>
    <a 
      href={`${process.env.NEXT_PUBLIC_SERVER_URL}/reset-password?token=${token}`}
      style={{
        backgroundColor: '#0070f3',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '6px',
        textDecoration: 'none',
        display: 'inline-block',
        fontSize: '16px',
      }}
    >
      Reset Password
    </a>
  </div>
);
