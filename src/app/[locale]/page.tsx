import { getTranslations } from "next-intl/server";

export default async function LandingPage() {
  const t = await getTranslations("metadata");

  return (
    <div>
      <h1>{t("title")}</h1>
    </div>
  );
}
