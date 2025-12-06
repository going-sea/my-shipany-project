import {
  CTA as CTAType,
  Showcases as ShowcasesType,
} from '@/shared/types/blocks/landing';
import { CTA, Showcases } from '@/themes/default/blocks';

export default async function ShowcasesPage({
  locale,
  showcases,
  cta,
}: {
  locale?: string;
  showcases: ShowcasesType;
  cta?: CTAType;
}) {
  return (
    <>
      <Showcases section={showcases} />
      {cta && <CTA section={cta} className="bg-muted" />}
    </>
  );
}
