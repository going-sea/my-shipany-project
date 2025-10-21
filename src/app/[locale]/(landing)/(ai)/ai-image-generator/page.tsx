import { getTranslations } from 'next-intl/server';

import { ImageGenerator } from '@/shared/blocks/generator/image';
import { getMetadata } from '@/shared/lib/seo';
import { CTA, FAQ, Hero, Showcases } from '@/themes/default/blocks';

export const generateMetadata = getMetadata({
  metadataKey: 'demo.ai-image-generator',
});

export default async function ImageGeneratorPage() {
  const t = await getTranslations('landing');
  const td = await getTranslations('demo.ai-image-generator');

  const hero = {
    title: td('title'),
    description: td('description'),
    tip: td('tip'),
  };

  return (
    <>
      <Hero hero={hero} />

      <ImageGenerator />
    </>
  );
}
