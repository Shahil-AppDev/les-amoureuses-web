import React from 'react';
import { Platform, Linking } from 'react-native';
import { PageScreen } from '../../components/screens';
import { P, CTAButton } from '../../components/ui';
import { SITE } from '../../constants/theme';
export default function Page() {
  const url = `${SITE.fr}/en/my-account/`;
  return (
    <PageScreen lang="en" title="My account" canonical="/en/my-account/">
      <P>The customer account is managed by WooCommerce, the estate's e-commerce engine (source of truth for orders and data).</P>
      <CTAButton label="Go to my account" onPress={() => (Platform.OS === 'web' ? (window.location.href = url) : Linking.openURL(url))} />
    </PageScreen>
  );
}
