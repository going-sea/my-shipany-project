import { Landing } from '@/shared/types/blocks/landing';
import {
  CTA,
  FAQ,
  Features,
  FeaturesAccordion,
  FeaturesList,
  FeaturesStep,
  Hero,
  Logos,
  Stats,
  Subscribe,
  Testimonials,
} from '@/themes/default/blocks';

export default async function LandingPage({
  locale,
  page,
}: {
  locale?: string;
  page: Landing;
}) {
  return (
    <>
      {page.hero && <Hero section={page.hero} />}
      {page.logos && <Logos section={page.logos} />}
      {page.introduce && <FeaturesList section={page.introduce} />}
      {page.benefits && <FeaturesAccordion section={page.benefits} />}
      {page.usage && <FeaturesStep section={page.usage} />}
      {page.features && <Features section={page.features} />}
      {page.stats && <Stats section={page.stats} className="bg-muted" />}
      {page.testimonials && <Testimonials section={page.testimonials} />}
      {page.subscribe && (
        <Subscribe section={page.subscribe} className="bg-muted" />
      )}
      {page.faq && <FAQ section={page.faq} />}
      {page.cta && <CTA section={page.cta} className="bg-muted" />}
    </>
  );
}
