import React from 'react';

/**
 * PageSubtitleAndError Component
 *
 * This component renders a subtitle and an optional error message.
 * It takes two props:
 * - `subtitle`: A string that represents the subtitle to be displayed.
 * - `serverError`: A string that represents an error message to be displayed if there is a server error.
 * If `serverError` is provided, it will be displayed in a styled div below the subtitle.
 *
 * @param {Object} props - The component props.
 * @param {string} props.subtitle - The subtitle to be displayed.
 * @param {string} props.serverError - The server error message to be displayed.
 * @returns {JSX.Element} The rendered component.
 */
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
