import React from 'react';
import { PageScreen } from '../../components/screens';
import { P } from '../../components/ui';
export default function Page() {
  return (
    <PageScreen lang="en" title="The Estate" canonical="/en/les-lieux/" frUrl="/les-lieux/" enUrl="/en/les-lieux/">
      <P>Certified organic (ECOCERT) and biodynamic (DEMETER) viticulture in Ardèche — a free, forward-looking project faithful to its values.</P>
    </PageScreen>
  );
}
