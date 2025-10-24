'use client';

import { useEffect, useState } from 'react';
import { CalendarIcon, ListIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import {
  getTocItems,
  MarkdownPreview,
  type TocItem,
} from '@/shared/blocks/common';
import { Crumb } from '@/shared/blocks/common/crumb';
import { type Post as PostType } from '@/shared/types/blocks/blog';
import { NavItem } from '@/shared/types/blocks/common';

export function BlogDetail({ post }: { post: PostType }) {
  const t = useTranslations('blog.page');

  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  const crumbItems: NavItem[] = [
    {
      title: t('crumb'),
      url: '/blog',
      icon: 'Newspaper',
      is_active: false,
    },
    {
      title: post.title || '',
      url: `/blog/${post.slug}`,
      is_active: true,
    },
  ];

  useEffect(() => {
    if (post.content) {
      const toc = getTocItems(post.content);
      setTocItems(toc);
    }
  }, [post.content]);

  useEffect(() => {
    const handleScroll = () => {
      const headings = tocItems
        .map((item) => document.getElementById(item.id))
        .filter(Boolean);

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        if (heading && heading.getBoundingClientRect().top <= 100) {
          setActiveId(heading.id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Update URL hash
      window.history.pushState(null, '', `#${id}`);

      // Calculate offset to account for fixed header
      const header =
        document.querySelector('header') || document.querySelector('nav');
      const headerOffset = header ? header.offsetHeight + 96 : 150;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  // Check if TOC should be shown
  const showToc = tocItems.length > 0;

  // Check if Author info should be shown
  const showAuthor = post.author_name || post.author_image || post.author_role;

  // Calculate main content column span based on what sidebars are shown
  const getMainColSpan = () => {
    if (showToc && showAuthor) return 'lg:col-span-6';
    if (showToc || showAuthor) return 'lg:col-span-9';
    return 'lg:col-span-12';
  };

  return (
    <section id={post.id}>
      <div className="py-24 md:py-32">
        <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
          <Crumb items={crumbItems} />

          {/* Header Section */}
          <div className="mt-16 text-center">
            <h1 className="text-foreground mx-auto mb-4 w-full text-3xl font-bold md:max-w-4xl md:text-4xl">
              {post.title}
            </h1>
            <div className="text-muted-foreground text-md mb-8 flex items-center justify-center gap-4">
              {post.created_at && (
                <div className="text-muted-foreground text-md mb-8 flex items-center justify-center gap-2">
                  <CalendarIcon className="size-4" /> {post.created_at}
                </div>
              )}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Table of Contents - Left Sidebar */}
            {showToc && (
              <div className="lg:col-span-3">
                <div className="sticky top-24 hidden md:block">
                  <div className="bg-muted/30 rounded-lg">
                    <h2 className="text-foreground px-4 pt-4 font-semibold">
                      <div className="flex items-center gap-2">
                        <ListIcon className="size-4" /> {t('toc')}
                      </div>
                    </h2>
                    <nav className="space-y-2 p-4">
                      {tocItems.map((item) => (
                        <li
                          key={item.id}
                          onClick={() => scrollToHeading(item.id)}
                          className={`line-clamp-1 block w-full cursor-pointer rounded-md py-1 text-left text-sm transition-colors ${
                            activeId === item.id
                              ? 'bg-primary text-primary-foreground font-medium'
                              : 'hover:bg-muted hover:text-muted-foreground text-muted-foreground'
                          }`}
                          style={{ paddingLeft: `${(item.level - 0) * 8}px` }}
                        >
                          {item.text}
                        </li>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content - Center */}
            <div className={getMainColSpan()}>
              <article className="p-0">
                {post.content && (
                  <div className="prose prose-lg text-muted-foreground max-w-none space-y-6 *:leading-relaxed">
                    <MarkdownPreview content={post.content} />
                  </div>
                )}
              </article>
            </div>

            {/* Author Info - Right Sidebar */}
            {showAuthor && (
              <div className="lg:col-span-3">
                <div className="sticky top-24">
                  <div className="bg-muted/30 rounded-lg p-6">
                    <div className="text-center">
                      {post.author_image && (
                        <div className="ring-foreground/10 mx-auto mb-4 aspect-square size-20 overflow-hidden rounded-xl border border-transparent shadow-md ring-1 shadow-black/15">
                          <img
                            src={post.author_image}
                            alt={post.author_name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      {post.author_name && (
                        <p className="text-foreground mb-1 text-lg font-semibold">
                          {post.author_name}
                        </p>
                      )}
                      {post.author_role && (
                        <p className="text-muted-foreground mb-4 text-sm">
                          {post.author_role}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
