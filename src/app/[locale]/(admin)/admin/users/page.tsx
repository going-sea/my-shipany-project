import { Header, Main, MainHeader } from "@/shared/blocks/dashboard";
import { TableCard } from "@/shared/blocks/table";
import { type Table } from "@/shared/types/blocks/table";
import { getUsers } from "@/shared/services/user";
import { getTranslations } from "next-intl/server";
import { Crumb } from "@/shared/types/blocks/common";

export default async function AdminUsersPage() {
  const t = await getTranslations("admin.user.list");

  const users = await getUsers();

  const crumbs: Crumb[] = [
    { title: "Admin", url: "/admin" },
    { title: "Users", is_active: true },
  ];

  const table: Table = {
    columns: [
      { name: "id", title: "ID", type: "copy" },
      { name: "name", title: "Name" },
      { name: "image", title: "Avatar", type: "image" },
      { name: "email", title: "Email", type: "copy" },
      { name: "emailVerified", title: "Email Verified", type: "label" },
      { name: "createdAt", title: "Created At", type: "time" },
    ],
    data: users,
  };

  return (
    <>
      <Header crumbs={crumbs} />
      <Main>
        <MainHeader title={t("title")} />
        <TableCard table={table} />
      </Main>
    </>
  );
}
