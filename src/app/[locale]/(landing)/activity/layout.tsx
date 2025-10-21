import { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';

import { ConsoleLayout } from '@/shared/blocks/console/layout';
import { getPathname } from '@/shared/lib/browser';
import { Nav } from '@/shared/types/blocks/common';

export default async function ActivityLayout({
  children,
}: {
  children: ReactNode;
}) {
  const t = await getTranslations('activity.sidebar');

  // settings title
  const title = t('title');

  const pathname = await getPathname();

  // settings nav
  const nav: Nav = {
    title: t('title'),
    items: [
      {
        title: t('nav.tasks'),
        url: '/activity/ai-tasks',
        icon: 'RiTaskLine',
        is_active: pathname === '/activity/ai-tasks',
      },
      // {
      //   title: 'Chats',
      //   url: '/activity/chats',
      //   icon: 'Chat',
      //   is_active: pathname === '/activity/chats',
      // },
      // {
      //   title: 'Feedbacks',
      //   url: '/activity/feedbacks',
      //   icon: 'Feedback',
      //   is_active: pathname === '/activity/feedbacks',
      // },
    ],
  };

  const topNav: Nav = {
    items: [
      {
        title: t('top_nav.activity'),
        url: '/activity',
        icon: 'Activity',
        is_active: true,
      },
      {
        title: t('top_nav.settings'),
        url: '/settings',
        icon: 'RiSettingsLine',
        is_active: false,
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
