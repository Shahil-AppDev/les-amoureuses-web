import React from 'react';
import { colors } from '../constants/theme';

export function HtmlContent({ html, excerpt }: { html: string | null; excerpt: string }) {
  if (!html) return <p style={{ color: colors.inkSoft }}>{excerpt}</p>;
  return (
    <div
      style={{ color: colors.inkSoft, fontSize: 16, lineHeight: 1.7 }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
