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
import {
  getSubscriptions,
  getSubscriptionsCount,
} from "@/shared/services/subscription";

export default async function SubscriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: number;
    pageSize?: number;
    interval?: string;
  }>;
}) {
  const user = await getUserInfo();
  if (!user) {
    return <Empty message="no auth" />;
  }

  const { page: pageNum, pageSize, interval } = await searchParams;
  const page = pageNum || 1;
  const limit = pageSize || 30;

  const crumbs: Crumb[] = [
    { title: "Admin", url: "/admin" },
    { title: "Subscriptions", is_active: true },
  ];

  const tabs: Tab[] = [
    {
      name: "all",
      title: "All",
      url: "/admin/subscriptions",
      is_active: !interval || interval === "all",
    },
    {
      name: "month",
      title: "Month",
      url: "/admin/subscriptions?interval=month",
      is_active: interval === "month",
    },
    {
      name: "year",
      title: "Year",
      url: "/admin/subscriptions?interval=year",
      is_active: interval === "year",
    },
  ];

  const total = await getSubscriptionsCount({
    interval,
  });

  const subscriptions = await getSubscriptions({
    interval,
    getUser: true,
    page,
    limit,
  });

  const table: Table = {
    columns: [
      { name: "subscriptionNo", title: "Subscription No", type: "copy" },
      { name: "user", title: "User", type: "user" },
      {
        title: "Price",
        callback: (item) => {
          return (
            <div className="text-primary">{`${item.amount / 100} ${
              item.currency
            }`}</div>
          );
        },
        type: "copy",
      },
      {
        name: "interval",
        title: "Interval",
        type: "label",
        placeholder: "-",
      },
      {
        name: "paymentProvider",
        title: "Provider",
        type: "label",
      },
      { name: "createdAt", title: "Created At", type: "time" },
      {
        name: "currentPeriodStart",
        title: "Current Period Start",
        type: "time",
        metadata: { format: "YYYY-MM-DD HH:mm:ss" },
      },
      {
        name: "currentPeriodEnd",
        title: "Current Period End",
        type: "time",
        metadata: { format: "YYYY-MM-DD HH:mm:ss" },
      },
      { name: "status", title: "Status", type: "label" },
      { name: "description", title: "Description", placeholder: "-" },
      {
        name: "action",
        type: "dropdown",
        callback: (item: Credit) => {
          return [];
        },
      },
    ],
    data: subscriptions,
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
        <MainHeader title="Subscriptions" tabs={tabs} />
        <TableCard table={table} />
      </Main>
    </>
  );
}
