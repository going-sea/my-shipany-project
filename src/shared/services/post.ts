import { and, count, desc, eq, like } from 'drizzle-orm';
import moment from 'moment';

import { db } from '@/core/db';
import { postsSource } from '@/core/docs/source';
import { post } from '@/config/db/schema';
import {
  Category as BlogCategoryType,
  Post as BlogPostType,
} from '@/shared/types/blocks/blog';

import { getTaxonomies, TaxonomyStatus, TaxonomyType } from './taxonomy';

export type Post = typeof post.$inferSelect;
export type NewPost = typeof post.$inferInsert;
export type UpdatePost = Partial<Omit<NewPost, 'id' | 'createdAt'>>;

export enum PostType {
  ARTICLE = 'article',
  PAGE = 'page',
}

export enum PostStatus {
  PUBLISHED = 'published', // published and visible to the public
  PENDING = 'pending', // pending review by admin
  DRAFT = 'draft', // draft and not visible to the public
  ARCHIVED = 'archived', // archived means deleted
}

export async function addPost(data: NewPost) {
  const [result] = await db().insert(post).values(data).returning();

  return result;
}

export async function updatePost(id: string, data: UpdatePost) {
  const [result] = await db()
    .update(post)
    .set(data)
    .where(eq(post.id, id))
    .returning();

  return result;
}

export async function deletePost(id: string) {
  const result = await updatePost(id, {
    status: PostStatus.ARCHIVED,
  });

  return result;
}

export async function findPost({
  id,
  slug,
  status,
}: {
  id?: string;
  slug?: string;
  status?: PostStatus;
}) {
  const [result] = await db()
    .select()
    .from(post)
    .where(
      and(
        id ? eq(post.id, id) : undefined,
        slug ? eq(post.slug, slug) : undefined,
        status ? eq(post.status, status) : undefined
      )
    )
    .limit(1);

  return result;
}

export async function getPosts({
  type,
  status,
  category,
  tag,
  page = 1,
  limit = 30,
}: {
  type?: PostType;
  status?: PostStatus;
  category?: string;
  tag?: string[];
  page?: number;
  limit?: number;
} = {}): Promise<Post[]> {
  const result = await db()
    .select()
    .from(post)
    .where(
      and(
        type ? eq(post.type, type) : undefined,
        status ? eq(post.status, status) : undefined,
        category ? like(post.categories, `%${category}%`) : undefined,
        tag ? like(post.tags, `%${tag}%`) : undefined
      )
    )
    .orderBy(desc(post.updatedAt), desc(post.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  return result;
}

export async function getPostsCount({
  type,
  status,
  category,
  tag,
}: {
  type?: PostType;
  status?: PostStatus;
  category?: string;
  tag?: string;
} = {}): Promise<number> {
  const [result] = await db()
    .select({ count: count() })
    .from(post)
    .where(
      and(
        type ? eq(post.type, type) : undefined,
        status ? eq(post.status, status) : undefined,
        category ? like(post.categories, `%${category}%`) : undefined,
        tag ? like(post.tags, `%${tag}%`) : undefined
      )
    )
    .limit(1);

  return result?.count || 0;
}

// get single post, both from local file and database
// database post has higher priority
export async function getPost({
  slug,
  locale,
  postPrefix = '/blog/',
}: {
  slug: string;
  locale: string;
  postPrefix?: string;
}): Promise<BlogPostType | null> {
  let post: BlogPostType | null = null;

  // get post from database
  const postData = await findPost({ slug, status: PostStatus.PUBLISHED });
  if (postData) {
    // post exist in database
    post = {
      id: postData.id,
      slug: postData.slug,
      title: postData.title || '',
      description: postData.description || '',
      content: postData.content || '',
      created_at:
        getPostDate({
          created_at: postData.createdAt.toISOString(),
          locale,
        }) || '',
      author_name: postData.authorName || '',
      author_image: postData.authorImage || '',
      author_role: '',
      url: `${postPrefix}${postData.slug}`,
    };

    return post;
  }

  // get post from locale file
  const localPost = await postsSource.getPage([slug], locale);
  if (localPost) {
    const frontmatter = localPost.data as any;

    const slug = getPostSlug({
      url: localPost.url,
      locale,
      prefix: postPrefix,
    });

    post = {
      id: localPost.path,
      slug: slug,
      title: localPost.data.title || '',
      description: localPost.data.description || '',
      content: removePostFrontmatter(localPost.data.content || ''),
      created_at: frontmatter.created_at
        ? getPostDate({
            created_at: frontmatter.created_at,
            locale,
          })
        : '',
      author_name: frontmatter.author_name || '',
      author_image: frontmatter.author_image || '',
      author_role: '',
      url: `${postPrefix}${slug}`,
    };

    return post;
  }

  return null;
}

// get posts and categories, both from local files and database
export async function getPostsAndCategories({
  page = 1,
  limit = 30,
  locale,
  postPrefix = '/blog/',
  categoryPrefix = '/blog/category/',
}: {
  page?: number;
  limit?: number;
  locale: string;
  postPrefix?: string;
  categoryPrefix?: string;
}) {
  let posts: BlogPostType[] = [];
  let categories: BlogCategoryType[] = [];

  // merge posts from both locale and remote, remove duplicates by slug
  // remote posts have higher priority
  const postsMap = new Map<string, BlogPostType>();

  // 1. get local posts
  const {
    posts: localPosts,
    postsCount: localPostsCount,
    categories: localCategories,
    categoriesCount: localCategoriesCount,
  } = await getLocalPostsAndCategories({
    locale,
    postPrefix,
    categoryPrefix,
  });

  // add local posts to postsMap
  localPosts.forEach((post) => {
    if (post.slug) {
      postsMap.set(post.slug, post);
    }
  });

  // 2. get remote posts
  const {
    posts: remotePosts,
    postsCount: remotePostsCount,
    categories: remoteCategories,
    categoriesCount: remoteCategoriesCount,
  } = await getRemotePostsAndCategories({
    page,
    limit,
    locale,
    postPrefix,
    categoryPrefix,
  });

  // add remote posts to postsMap
  remotePosts.forEach((post) => {
    if (post.slug) {
      postsMap.set(post.slug, post);
    }
  });

  // Convert map to array and sort by created_at desc
  posts = Array.from(postsMap.values()).sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });

  return {
    posts,
    postsCount: posts.length,
    categories: remoteCategories, // todo: merge local categories
    categoriesCount: remoteCategoriesCount, // todo: merge local categories count
  };
}

// get remote posts and categories
export async function getRemotePostsAndCategories({
  page = 1,
  limit = 30,
  locale,
  postPrefix = '/blog/',
  categoryPrefix = '/blog/category/',
}: {
  page?: number;
  limit?: number;
  locale: string;
  postPrefix?: string;
  categoryPrefix?: string;
}) {
  const dbPostsList: BlogPostType[] = [];
  const dbCategoriesList: BlogCategoryType[] = [];

  // get posts from database
  const dbPosts = await getPosts({
    type: PostType.ARTICLE,
    status: PostStatus.PUBLISHED,
    page,
    limit,
  });

  if (!dbPosts || dbPosts.length === 0) {
    return {
      posts: [],
      postsCount: 0,
      categories: [],
      categoriesCount: 0,
    };
  }

  dbPostsList.push(
    ...dbPosts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title || '',
      description: post.description || '',
      author_name: post.authorName || '',
      author_image: post.authorImage || '',
      created_at:
        getPostDate({
          created_at: post.createdAt.toISOString(),
          locale,
        }) || '',
      image: post.image || '',
      url: `${postPrefix}${post.slug}`,
    }))
  );

  // get categories from database
  const dbCategories = await getTaxonomies({
    type: TaxonomyType.CATEGORY,
    status: TaxonomyStatus.PUBLISHED,
  });

  dbCategoriesList.push(
    ...(dbCategories || []).map((category) => ({
      id: category.id,
      slug: category.slug,
      title: category.title,
      url: `${categoryPrefix}${category.slug}`,
    }))
  );

  return {
    posts: dbPostsList,
    postsCount: dbPostsList.length,
    categories: dbCategoriesList,
    categoriesCount: dbCategoriesList.length,
  };
}

// get local posts and categories
export async function getLocalPostsAndCategories({
  locale,
  postPrefix = '/blog/',
  categoryPrefix = '/blog/category/',
}: {
  locale: string;
  postPrefix?: string;
  categoryPrefix?: string;
}) {
  const localPostsList: BlogPostType[] = [];

  // get posts from local files
  const localPosts = postsSource.getPages(locale);

  // no local posts
  if (!localPosts || localPosts.length === 0) {
    return {
      posts: [],
      postsCount: 0,
      categories: [],
      categoriesCount: 0,
    };
  }

  // Build posts data from local content
  localPostsList.push(
    ...localPosts.map((post) => {
      const frontmatter = post.data as any;
      const slug = getPostSlug({
        url: post.url,
        locale,
        prefix: postPrefix,
      });

      return {
        id: post.path,
        slug: slug,
        title: post.data.title || '',
        description: post.data.description || '',
        author_name: frontmatter.author_name || '',
        author_image: frontmatter.author_image || '',
        created_at: frontmatter.created_at
          ? getPostDate({
              created_at: frontmatter.created_at,
              locale,
            })
          : '',
        image: frontmatter.image || '',
        url: `${postPrefix}${slug}`,
      };
    })
  );

  return {
    posts: localPostsList,
    postsCount: localPostsList.length,
    categories: [],
    categoriesCount: 0,
  };
}

// Helper function to replace slug for local posts
export function getPostSlug({
  url,
  locale,
  prefix = '/blog/',
}: {
  url: string; // post url, like: /zh/blog/what-is-xxx
  locale: string; // locale
  prefix?: string; // post slug prefix
}): string {
  if (url.startsWith(prefix)) {
    return url.replace(prefix, '');
  } else if (url.startsWith(`/${locale}${prefix}`)) {
    return url.replace(`/${locale}${prefix}`, '');
  }

  return url;
}

function getPostDate({
  created_at,
  locale,
}: {
  created_at: string;
  locale?: string;
}) {
  return moment(created_at)
    .locale(locale || 'en')
    .format(locale === 'zh' ? 'YYYY/MM/DD' : 'MMM D, YYYY');
}

// Helper function to remove frontmatter from markdown content
export function removePostFrontmatter(content: string): string {
  // Match frontmatter pattern: ---\n...content...\n---
  const frontmatterRegex = /^---\r?\n[\s\S]*?\r?\n---\r?\n/;
  return content.replace(frontmatterRegex, '').trim();
}
