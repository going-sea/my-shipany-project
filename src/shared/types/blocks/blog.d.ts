export interface Blog {
  id?: string;
  sr_only_title?: string;
  title?: string;
  description?: string;
  categories?: Category[];
  currentCategory?: Category;
  posts: Post[];
  className?: string;
}

export interface Post {
  id?: string;
  slug?: string;
  title?: string;
  description?: string;
  image?: string;
  content?: string;
  created_at?: string;
  author_name?: string;
  author_role?: string;
  author_image?: string;
  url?: string;
  target?: string;
  categories?: Category[];
  body?: any;
}

export interface Category {
  id?: string;
  slug?: string;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  target?: string;
}
