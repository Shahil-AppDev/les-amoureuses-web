import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { PostScreen } from '../components/screens';
import { POSTS } from '../data/posts';

export function generateStaticParams() {
  return POSTS.map((p) => ({ post: p.slug }));
}

export default function Post() {
  const { post } = useLocalSearchParams<{ post: string }>();
  return <PostScreen slug={post} lang="fr" />;
}
