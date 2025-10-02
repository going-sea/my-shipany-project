import { Header, Main, MainHeader } from "@/shared/blocks/dashboard";
import { TableCard } from "@/shared/blocks/table";
import { type Table } from "@/shared/types/blocks/table";
import { getUserInfo } from "@/shared/services/user";
import {
  getCredits,
  getCreditsCount,
  Credit,
  CreditStatus,
  CreditTransactionType,
} from "@/shared/services/credit";

import { Crumb, Tab } from "@/shared/types/blocks/common";
import { Empty } from "@/shared/blocks/common";

export default async function CreditsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: number; pageSize?: number; type?: string }>;
}) {
  const user = await getUserInfo();
  if (!user) {
    return <Empty message="no auth" />;
  }

  const { page: pageNum, pageSize, type } = await searchParams;
  const page = pageNum || 1;
  const limit = pageSize || 30;

  const crumbs: Crumb[] = [
    { title: "Admin", url: "/admin" },
    { title: "Credits", is_active: true },
  ];

  const tabs: Tab[] = [
    {
      name: "all",
      title: "All",
      url: "/admin/credits",
      is_active: !type || type === "all",
    },
    {
      name: "grant",
      title: "Grant",
      url: "/admin/credits?type=grant",
      is_active: type === "grant",
    },
    {
      name: "consume",
      title: "Consume",
      url: "/admin/credits?type=consume",
      is_active: type === "consume",
    },
  ];

  const total = await getCreditsCount({
    transactionType: type as CreditTransactionType,
    status: CreditStatus.ACTIVE,
  });

  const credits = await getCredits({
    transactionType: type as CreditTransactionType,
    status: CreditStatus.ACTIVE,
    getUser: true,
    page,
    limit,
  });

  const table: Table = {
    columns: [
      { name: "transactionNo", title: "Transaction No", type: "copy" },
      { name: "user", title: "User", type: "user" },
      {
        name: "credits",
        title: "Amount",
        callback: (item) => {
          if (item.credits > 0) {
            return <div className="text-green-500">+{item.credits}</div>;
          } else {
            return <div className="text-red-500">{item.credits}</div>;
          }
        },
      },
      {
        name: "remainingCredits",
        title: "Remaining",
        type: "label",
        placeholder: "-",
      },
      { name: "transactionType", title: "Type" },
      { name: "transactionScene", title: "Scene", placeholder: "-" },
      { name: "description", title: "Description", placeholder: "-" },
      { name: "createdAt", title: "Created At", type: "time" },
      {
        name: "expiresAt",
        title: "Expires At",
        type: "time",
        metadata: { format: "YYYY-MM-DD HH:mm:ss" },
      },
      {
        name: "action",
        type: "dropdown",
        callback: (item: Credit) => {
          return [];
        },
      },
    ],
    data: credits,
    pagination: {
      total,
      page,
      limit,
    },
  };

  return (
    <>
      <Header crumbs={crumbs} />
      <Main>
        <MainHeader title="Credits" tabs={tabs} />
        <TableCard table={table} />
      </Main>
    </>
  );
}
