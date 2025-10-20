import { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { DashboardLayout } from "@/shared/blocks/dashboard/layout";
import { Sidebar as SidebarType } from "@/shared/types/blocks/dashboard";
import { requireAdminAccess } from "@/core/rbac/permission";
import { LocaleDetector } from "@/shared/blocks/common";

/**
 * Admin layout to manage datas
 */
export default async function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Check if user has admin access permission
  await requireAdminAccess({
    redirectUrl: `/no-permission`,
    locale: locale || "",
  });

  const t = await getTranslations("admin");

  const sidebar: SidebarType = t.raw("sidebar");

  return (
    <DashboardLayout sidebar={sidebar}>
      <LocaleDetector />
      {children}
    </DashboardLayout>
  );
}
