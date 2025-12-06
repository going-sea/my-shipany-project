import { Subscription } from '@/shared/models/subscription';
import {
  FAQ as FAQType,
  Testimonials as TestimonialsType,
} from '@/shared/types/blocks/landing';
import { Pricing as PricingType } from '@/shared/types/blocks/pricing';
import { FAQ, Pricing, Testimonials } from '@/themes/default/blocks';

export default async function PricingPage({
  locale,
  pricing,
  currentSubscription,
  faq,
  testimonials,
}: {
  locale?: string;
  pricing: PricingType;
  currentSubscription?: Subscription;
  faq?: FAQType;
  testimonials?: TestimonialsType;
}) {
  return (
    <>
      <Pricing pricing={pricing} currentSubscription={currentSubscription} />
      {faq && <FAQ section={faq} />}
      {testimonials && <Testimonials section={testimonials} />}
    </>
  );
}
