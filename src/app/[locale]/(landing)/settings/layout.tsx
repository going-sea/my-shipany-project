import { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';

import { ConsoleLayout } from '@/shared/blocks/console/layout';
import { getPathname } from '@/shared/lib/browser';
import { Nav } from '@/shared/types/blocks/common';

export default async function SettingsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const t = await getTranslations('settings.sidebar');

  // settings title
  const title = t('title');

  const pathname = await getPathname();

  // settings nav
  const nav: Nav = {
    title: t('title'),
    items: [
      {
        title: t('nav.profile'),
        url: '/settings/profile',
        icon: 'User',
      },
      // {
      //   title: t("nav.security"),
      //   url: "/settings/security",
      //   icon: "Lock",
      // },
      {
        title: t('nav.billing'),
        url: '/settings/billing',
        icon: 'CreditCard',
      },
      {
        title: t('nav.payments'),
        url: '/settings/payments',
        icon: 'DollarSign',
      },
      {
        title: t('nav.credits'),
        url: '/settings/credits',
        icon: 'Coins',
      },
      {
        title: t('nav.apikeys'),
        url: '/settings/apikeys',
        icon: 'RiKeyLine',
      },
    ],
  };

  const topNav: Nav = {
    items: [
      {
        title: t('top_nav.activity'),
        url: '/activity',
        icon: 'Activity',
      },
      {
        title: t('top_nav.settings'),
        url: '/settings',
        icon: 'Settings',
        is_active: true,
      },
    ],
  };

  return (
    <ConsoleLayout
      title={title}
      nav={nav}
      topNav={topNav}
      className="py-16 md:py-20"
    >
      {children}
    </ConsoleLayout>
  );
}
