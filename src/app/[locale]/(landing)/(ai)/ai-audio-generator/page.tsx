import { getTranslations } from 'next-intl/server';

import { Hero } from '@/themes/default/blocks/hero';

export default async function AiAudioGeneratorPage() {
  const t = await getTranslations('landing');
  const tt = await getTranslations('demo.ai-audio-generator');

  return (
    <>
      <Hero
        section={{
          title: tt.raw('title'),
          description: tt.raw('description'),
        }}
      />
    </>
  );
}
