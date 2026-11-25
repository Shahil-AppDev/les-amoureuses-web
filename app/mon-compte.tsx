import React from 'react';
import { Platform, Linking, View } from 'react-native';
import { PageScreen } from '../components/screens';
import { P, CTAButton } from '../components/ui';
import { SITE } from '../constants/theme';
export default function Page() {
  const url = `${SITE.fr}/mon-compte/`;
  return (
    <PageScreen lang="fr" title="Mon compte" canonical="/mon-compte/">
      <P>Le compte client est géré par WooCommerce, le moteur e-commerce du domaine (source de vérité pour vos commandes et vos données).</P>
      <CTAButton label="Accéder à mon compte" onPress={() => (Platform.OS === 'web' ? (window.location.href = url) : Linking.openURL(url))} />
    </PageScreen>
  );
}
