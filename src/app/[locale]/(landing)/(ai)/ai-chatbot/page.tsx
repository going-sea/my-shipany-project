import { getTranslations } from 'next-intl/server';

import { Hero } from '@/themes/default/blocks/hero';

export default async function AiChatbotPage() {
  const t = await getTranslations('landing');
  const tt = await getTranslations('demo.ai-chatbot');

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
