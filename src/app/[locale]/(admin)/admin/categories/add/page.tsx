import { Header, Main, MainHeader } from "@/shared/blocks/dashboard";
import { FormCard } from "@/shared/blocks/form";
import { Form } from "@/shared/types/blocks/form";
import {
  addTaxonomy,
  NewTaxonomy,
  TaxonomyStatus,
  TaxonomyType,
} from "@/shared/services/taxonomy";
import { getUuid } from "@/shared/lib/hash";
import { getUserInfo } from "@/shared/services/user";
import { Crumb } from "@/shared/types/blocks/common";
import { Empty } from "@/shared/blocks/common";

export default async function CategoryAddPage() {
  const user = await getUserInfo();
  if (!user) {
    return <Empty message="no auth" />;
  }

  const crumbs: Crumb[] = [
    { title: "Admin", url: "/admin" },
    { title: "Categories", url: "/admin/categories" },
    { title: "Add Category", is_active: true },
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
      user: user,
    },
    data: {},
    submit: {
      button: {
        title: "Add Category",
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

        if (!slug?.trim() || !title?.trim()) {
          throw new Error("slug and title are required");
        }

        const newCategory: NewTaxonomy = {
          id: getUuid(),
          userId: user.id,
          parentId: "", // todo: select parent category
          slug: slug.trim().toLowerCase(),
          type: TaxonomyType.CATEGORY,
          title: title.trim(),
          description: description.trim(),
          image: "",
          icon: "",
          status: TaxonomyStatus.PUBLISHED,
        };

        const result = await addTaxonomy(newCategory);

        if (!result) {
          throw new Error("add category failed");
        }

        return {
          status: "success",
          message: "category added",
          redirect_url: "/admin/categories",
        };
      },
    },
  };

  return (
    <>
      <Header crumbs={crumbs} />
      <Main>
        <MainHeader title="Add Category" />
        <FormCard form={form} className="md:max-w-xl" />
      </Main>
    </>
  );
}
