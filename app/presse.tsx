import React from 'react';
import { PageScreen } from '../components/screens';
import { P } from '../components/ui';
export default function Page() {
  return (
    <PageScreen lang="fr" title="Presse" canonical="/presse/">
      <P>Contact presse : contact@lesamoureuses.wine · +33 (0)4 75 54 51 85</P>
    </PageScreen>
  );
}
