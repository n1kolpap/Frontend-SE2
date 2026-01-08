import React from 'react';

export default function PageSubtitleAndError({ subtitle, serverError }) {
  return (
    <>
      <p className="page-subtitle">{subtitle}</p>

      {serverError && (
        <div
          style={{
            marginBottom: '0.75rem',
            fontSize: '0.8rem',
            color: 'var(--color-danger)',
            backgroundColor: 'var(--color-danger-soft)',
            padding: '0.4rem 0.6rem',
            borderRadius: '0.75rem',
          }}
        >
          {serverError}
        </div>
      )}
    </>
  );
}
