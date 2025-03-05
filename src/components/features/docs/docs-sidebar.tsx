import { SidebarMenuLink } from "@/components/features/docs/sidebar-menu-link";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getDocCategories } from "@/lib/docs";
import Image from "next/image";
import Link from "next/link";

export async function DocsSidebar() {
  const docCategories = await getDocCategories();

  return (
    <>
      <SidebarHeader className="h-13 bg-transparent flex items-center justify-center">
        <div className="flex gap-4 items-center">
          <Link href="/" className="text-xl font-bold font-mono">
            <Image
              src="/developers-logo.svg"
              width={226}
              height={42}
              alt="logo-dark"
              className="w-32"
            />
          </Link>
          <div className="font-mono text-muted-foreground text-sm"></div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {docCategories.map((category) => (
          <SidebarGroup key={category.name}>
            <SidebarGroupLabel>{category.name}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {category.items.map((item) => (
                  <SidebarMenuItem key={item.slug}>
                    <SidebarMenuLink href={`/docs/${item.slug}`}>
                      {item.title}
                    </SidebarMenuLink>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </>
  );
}
