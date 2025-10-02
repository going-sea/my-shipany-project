import { Header, Main, MainHeader } from "@/shared/blocks/dashboard";
import { TableCard } from "@/shared/blocks/table";
import { type Table } from "@/shared/types/blocks/table";
import { getUserInfo } from "@/shared/services/user";

import { Crumb, Tab } from "@/shared/types/blocks/common";
import { Empty } from "@/shared/blocks/common";
import { getOrders, getOrdersCount, Order } from "@/shared/services/order";
import { PaymentType } from "@/extensions/payment";

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: number;
    pageSize?: number;
    type?: string;
  }>;
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
    { title: "Payments", is_active: true },
  ];

  const tabs: Tab[] = [
    {
      name: "all",
      title: "All",
      url: "/admin/payments",
      is_active: !type || type === "all",
    },
    {
      name: "subscription",
      title: "Subscription",
      url: "/admin/payments?type=subscription",
      is_active: type === "subscription",
    },
    {
      name: "one-time",
      title: "One-Time",
      url: "/admin/payments?type=one-time",
      is_active: type === "one-time",
    },
  ];

  const total = await getOrdersCount({
    paymentType: type as PaymentType,
  });

  const payments = await getOrders({
    paymentType: type as PaymentType,
    getUser: true,
    page,
    limit,
  });

  const table: Table = {
    columns: [
      { name: "orderNo", title: "Order No", type: "copy" },
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
        name: "productId",
        title: "Product",
        type: "label",
        placeholder: "-",
      },
      { name: "description", title: "Description", placeholder: "-" },
      {
        name: "paymentType",
        title: "Type",
        type: "label",
        placeholder: "-",
      },
      {
        name: "paymentProvider",
        title: "Provider",
        type: "label",
      },
      { name: "createdAt", title: "Created At", type: "time" },
      { name: "status", title: "Status", type: "label" },
      {
        name: "action",
        type: "dropdown",
        callback: (item: Order) => {
          return [];
        },
      },
    ],
    data: payments,
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
        <MainHeader title="Payments" tabs={tabs} />
        <TableCard table={table} />
      </Main>
    </>
  );
}
