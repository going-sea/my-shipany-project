"use client";

import { cn } from "@/shared/lib/utils";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { ScrollBar } from "@/shared/components/ui/scroll-area";
import { Button as ButtonType, Tab } from "@/shared/types/blocks/common";
import { Link, usePathname, useRouter } from "@/core/i18n/navigation";
import { Button } from "@/shared/components/ui/button";
import { SmartIcon } from "@/shared/blocks/common/smart-icon";
import { TabsTrigger, Tabs, TabsList } from "@/shared/components/ui/tabs";
import { useEffect, useState } from "react";

export function MainHeader({
  title,
  description,
  tabs,
  actions,
}: {
  title?: string;
  description?: string;
  tabs?: Tab[];
  actions?: ButtonType[];
}) {
  const url = typeof window !== "undefined" ? window.location.href : "";
  const router = useRouter();
  const [tabName, setTabName] = useState(
    tabs?.find((tab) => tab.is_active)?.name || ""
  );
  const [tab, setTab] = useState({} as Tab);

  useEffect(() => {
    if (tabName) {
      setTab(tabs?.find((tab) => tab.name === tabName) || ({} as Tab));
    }
  }, [tabName]);

  useEffect(() => {
    console.log("tab", tab);
    if (tab && tab.url && tab.url !== url) {
      router.push(tab.url);
    }
  }, [tab]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold tracking-tight">{title || ""}</h2>
          <p className="text-muted-foreground">{description || ""}</p>
        </div>
        <div>
          {actions?.map((action, idx) => (
            <Link
              key={idx}
              href={action.url || ""}
              target={action.target || "_self"}
            >
              <Button
                onClick={action.onClick}
                variant={action.variant || "default"}
                size={action.size || "sm"}
              >
                {action.icon && <SmartIcon name={action.icon as string} />}
                {action.title}
              </Button>
            </Link>
          ))}
        </div>
      </div>
      {tabs && tabs.length > 0 ? (
        <div className="relative mb-8">
          <ScrollArea className="w-full lg:max-w-none">
            <div className="space-x-2 flex items-center">
              <Tabs value={tabName} onValueChange={setTabName}>
                <TabsList>
                  {tabs.map((tab, idx) => (
                    <TabsTrigger key={idx} value={tab.name || ""}>
                      {tab.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
        </div>
      ) : null}
    </div>
  );
}
