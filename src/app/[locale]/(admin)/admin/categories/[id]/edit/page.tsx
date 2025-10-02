import { Header, Main, MainHeader } from "@/shared/blocks/dashboard";
import { FormCard } from "@/shared/blocks/form";
import { Form } from "@/shared/types/blocks/form";
import {
  findTaxonomy,
  TaxonomyStatus,
  updateTaxonomy,
  UpdateTaxonomy,
} from "@/shared/services/taxonomy";
import { getUserInfo } from "@/shared/services/user";
import { Empty } from "@/shared/blocks/common";
import { Crumb } from "@/shared/types/blocks/common";

export default async function CategoryEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const category = await findTaxonomy({ id });
  if (!category) {
    return <Empty message="Category not found" />;
  }

  const user = await getUserInfo();
  if (!user) {
    return <Empty message="no auth" />;
  }

  if (!user || category.userId !== user.id) {
    return <Empty message="access denied" />;
  }

  const crumbs: Crumb[] = [
    { title: "Admin", url: "/admin" },
    { title: "Categories", url: "/admin/categories" },
    { title: "Edit Category", is_active: true },
  ];

  const form: Form = {
    fields: [
      {
        name: "slug",
        type: "text",
        title: "Slug",
        tip: "unique slug for the category",
        validation: { required: true },
      },
      {
        name: "title",
        type: "text",
        title: "Category Name",
        validation: { required: true },
      },
      {
        name: "description",
        type: "textarea",
        title: "Description",
      },
    ],
    passby: {
      type: "category",
      category: category,
      user: user,
    },
    data: category,
    submit: {
      button: {
        title: "Edit Category",
      },
      handler: async (data, passby) => {
        "use server";

        const { user, category } = passby;
        if (!user || !category || category.userId !== user.id) {
          throw new Error("access denied");
        }

        const slug = data.get("slug") as string;
        const title = data.get("title") as string;
        const description = data.get("description") as string;

        if (!slug?.trim() || !title?.trim()) {
          throw new Error("slug and title are required");
        }

        const updateCategory: UpdateTaxonomy = {
          parentId: "", // todo: select parent category
          slug: slug.trim().toLowerCase(),
          title: title.trim(),
          description: description.trim(),
          image: "",
          icon: "",
          status: TaxonomyStatus.PUBLISHED,
        };

        const result = await updateTaxonomy(category.id, updateCategory);

        if (!result) {
          throw new Error("update category failed");
        }

        return {
          status: "success",
          message: "category updated",
          redirect_url: "/admin/categories",
        };
      },
    },
  };

  return (
    <>
      <Header crumbs={crumbs} />
      <Main>
        <MainHeader title="Edit Category" />
        <FormCard form={form} className="md:max-w-xl" />
      </Main>
    </>
  );
}
