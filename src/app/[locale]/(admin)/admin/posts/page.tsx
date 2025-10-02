import { Header, Main, MainHeader } from "@/shared/blocks/dashboard";
import { TableCard } from "@/shared/blocks/table";
import { type Table } from "@/shared/types/blocks/table";
import { getUserInfo } from "@/shared/services/user";
import { getPosts, getPostsCount, Post } from "@/shared/services/post";
import { PostType } from "@/shared/services/post";
import { Button, Crumb } from "@/shared/types/blocks/common";
import { getTaxonomies, TaxonomyType } from "@/shared/services/taxonomy";
import { Empty } from "@/shared/blocks/common";

export default async function PostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: number; pageSize?: number }>;
}) {
  const { page: pageNum, pageSize } = await searchParams;
  const page = pageNum || 1;
  const limit = pageSize || 30;

  const user = await getUserInfo();
  if (!user) {
    return <Empty message="no auth" />;
  }

  const crumbs: Crumb[] = [
    { title: "Admin", url: "/admin" },
    { title: "Posts", is_active: true },
  ];

  const total = await getPostsCount({
    type: PostType.ARTICLE,
  });

  const posts = await getPosts({
    type: PostType.ARTICLE,
    page,
    limit,
  });

  const table: Table = {
    columns: [
      { name: "title", title: "Title" },
      {
        name: "categories",
        title: "Categories",
        callback: async (item: Post) => {
          if (!item.categories) {
            return "-";
          }
          const categoriesIds = item.categories.split(",");
          const categories = await getTaxonomies({
            ids: categoriesIds,
          });
          if (!categories) {
            return "-";
          }

          const categoriesNames = categories.map((category) => {
            return category.title;
          });

          return categoriesNames.join(", ");
        },
      },
      { name: "createdAt", title: "Created At", type: "time" },
      {
        name: "action",
        title: "",
        type: "dropdown",
        callback: (item: Post) => {
          return [
            {
              name: "edit",
              title: "Edit",
              icon: "RiEditLine",
              url: `/admin/posts/${item.id}/edit`,
            },
            {
              name: "view",
              title: "View",
              icon: "RiEyeLine",
              url: `/blog/${item.slug}`,
              target: "_blank",
            },
          ];
        },
      },
    ],
    data: posts,
    pagination: {
      total,
      page,
      limit,
    },
  };

  const actions: Button[] = [
    {
      id: "add",
      title: "Add Post",
      icon: "RiAddLine",
      url: "/admin/posts/add",
    },
  ];

  return (
    <>
      <Header crumbs={crumbs} />
      <Main>
        <MainHeader title="Posts" actions={actions} />
        <TableCard table={table} />
      </Main>
    </>
  );
}
