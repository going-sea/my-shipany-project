import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { setRequestLocale } from 'next-intl/server';

import { pagesSource, source } from '@/core/docs/source';
import { getThemePage } from '@/core/theme';
import { envConfigs } from '@/config';
import { Post } from '@/shared/types/blocks/blog';

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // Get the page from pagesSource
  const page = pagesSource.getPage([slug], locale);

  if (!page) notFound();

  const MDXContent = page.data.body;
  const body = (
    <MDXContent
      components={getMDXComponents({
        // this allows you to link to other pages with relative file paths
        a: createRelativeLink(source, page),
      })}
    />
  );

  const frontmatter = page.data as any;

  const post: Post = {
    id: page.path,
    slug: page.url,
    title: page.data.title,
    description: page.data.description || '',
    content: '',
    created_at: frontmatter.created_at
      ? new Date(frontmatter.created_at).toLocaleDateString()
      : '',
    author_name: frontmatter.author_name || '',
    body: body,
  };

  const Page = await getThemePage('page-detail');

  return <Page locale={locale} post={post} />;
}

export async function generateStaticParams() {
  // Generate static params for all pages
  return pagesSource.generateParams();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const page = pagesSource.getPage([slug], locale);

  if (!page) {
    return {
      title: slug,
      description: 'Page',
      alternates: {
        canonical: `/${locale}/${slug}`,
      },
    };
  }

  let canonicalUrl = `${envConfigs.app_url}${page.url}`;
  if (locale === envConfigs.locale) {
    canonicalUrl = `${envConfigs.app_url}${page.url.replace(`/${locale}`, '')}`;
  }

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}
