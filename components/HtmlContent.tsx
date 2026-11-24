import React from 'react';
import { Text } from 'react-native';
import { colors } from '../constants/theme';

export function HtmlContent({ html, excerpt }: { html: string | null; excerpt: string }) {
  const text = (html ?? excerpt)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return <Text style={{ color: colors.inkSoft, fontSize: 16, lineHeight: 26 }}>{text}</Text>;
}
