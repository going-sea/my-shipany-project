"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/shared/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { usePathname, useRouter, Link } from "@/core/i18n/navigation";
import { NavItem, type Nav as NavType } from "@/shared/types/blocks/common";
import { SmartIcon } from "@/shared/blocks/common/smart-icon";

export function Nav({ nav, className }: { nav: NavType; className?: string }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <SidebarGroup className={className}>
      <SidebarGroupContent className="flex flex-col gap-2 mt-0">
        {nav.title && <SidebarGroupLabel>{nav.title}</SidebarGroupLabel>}
        <SidebarMenu>
          {nav.items.map((item: NavItem | undefined) => (
            <Collapsible
              key={item?.title || item?.title || ""}
              asChild
              defaultOpen={item?.is_expand || false}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    tooltip={item?.title}
                    className={`${
                      item?.is_active ||
                      (item?.url && pathname.startsWith(item?.url as string))
                        ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                        : ""
                    }`}
                  >
                    <Link
                      href={item?.url as string}
                      target={item?.target as string}
                    >
                      {item?.icon && <SmartIcon name={item.icon as string} />}
                      <span>{item?.title || ""}</span>
                      {item?.children && (
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {item?.children && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.children?.map((subItem: NavItem) => (
                        <SidebarMenuSubItem
                          key={subItem.title || subItem.title}
                        >
                          <SidebarMenuSubButton
                            asChild
                            className={`${
                              subItem.is_active ||
                              pathname.endsWith(subItem.url as string)
                                ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                                : ""
                            }`}
                          >
                            <Link
                              href={subItem.url as string}
                              target={subItem.target as string}
                            >
                              <span className="px-2">{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
