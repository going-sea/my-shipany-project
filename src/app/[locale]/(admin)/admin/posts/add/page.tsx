import { Header, Main, MainHeader } from "@/shared/blocks/dashboard";
import { FormCard } from "@/shared/blocks/form";
import { Form } from "@/shared/types/blocks/form";
import { getUuid } from "@/shared/lib/hash";
import { getUserInfo } from "@/shared/services/user";
import { addPost, NewPost, PostType } from "@/shared/services/post";
import { PostStatus } from "@/shared/services/post";
import { Empty } from "@/shared/blocks/common";
import { Crumb } from "@/shared/types/blocks/common";

export default async function PostAddPage() {
  const user = await getUserInfo();
  if (!user) {
    return <Empty message="no auth" />;
  }

  const crumbs: Crumb[] = [
    { title: "Admin", url: "/admin" },
    { title: "Posts", url: "/admin/posts" },
    { title: "Add Post", is_active: true },
  ];

  const form: Form = {
    fields: [
      {
        name: "slug",
        type: "text",
        title: "Slug",
        tip: "unique slug for the post",
        validation: { required: true },
      },
      {
        name: "title",
        type: "text",
        title: "Post Title",
        validation: { required: true },
      },
      {
        name: "description",
        type: "textarea",
        title: "Description",
      },
      {
        name: "content",
        type: "markdown_editor",
        title: "Content",
      },
    ],
    passby: {
      type: "post",
      user: user,
    },
    data: {},
    submit: {
      button: {
        title: "Add Post",
      },
      handler: async (data, passby) => {
        "use server";

        const { user } = passby;
        if (!user) {
          throw new Error("no auth");
        }

        const slug = data.get("slug") as string;
        const title = data.get("title") as string;
        const description = data.get("description") as string;
        const content = data.get("content") as string;

        if (!slug?.trim() || !title?.trim()) {
          throw new Error("slug and title are required");
        }

        const newPost: NewPost = {
          id: getUuid(),
          userId: user.id,
          parentId: "", // todo: select parent category
          slug: slug.trim().toLowerCase(),
          type: PostType.ARTICLE,
          title: title.trim(),
          description: description.trim(),
          image: "",
          content: content.trim(),
          categories: "",
          tags: "",
          authorName: "",
          authorImage: "",
          status: PostStatus.PUBLISHED,
        };

        const result = await addPost(newPost);

        if (!result) {
          throw new Error("add post failed");
        }

        return {
          status: "success",
          message: "post added",
          redirect_url: "/admin/posts",
        };
      },
    },
  };

  return (
    <>
      <Header crumbs={crumbs} />
      <Main>
        <MainHeader title="Add Post" />
        <FormCard form={form} className="md:max-w-xl" />
      </Main>
    </>
  );
}
