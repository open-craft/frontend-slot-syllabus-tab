import * as React from 'react';

interface HighlightMatchProps {
  text: string;
  query: string;
}

export const HighlightMatch = ({ text, query }: HighlightMatchProps) => {
  if (!query) {
    return <div>{text}</div>;
  }

  const parts = text.split(new RegExp(`(${query})`, 'gi'));

  return (
    <div>
      {parts.map((part, index) => (index % 2 === 1 ? <b>{part}</b> : part))}
    </div>
  );
};
