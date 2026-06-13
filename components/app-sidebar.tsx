"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  BriefcaseBusinessIcon,
  CalendarDaysIcon,
  GalleryVerticalEndIcon,
  HomeIcon,
  ImageIcon,
  MessageSquareQuoteIcon,
  NewspaperIcon,
  Settings2Icon,
  UsersIcon,
} from "lucide-react"

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: {
    name: string
    email: string
    avatar: string
    role: string
  }
}

const data = {
  teams: [
    {
      name: "FMI Admin",
      logo: (
        <GalleryVerticalEndIcon
        />
      ),
      plan: "Dashboard",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: (
        <HomeIcon
        />
      ),
      isActive: true,
    },
    {
      title: "Berita",
      url: "/berita",
      icon: (
        <NewspaperIcon
        />
      ),
    },
    {
      title: "Galeri",
      url: "/galeri",
      icon: (
        <ImageIcon
        />
      ),
    },
    {
      title: "Layanan",
      url: "/layanan",
      icon: (
        <BriefcaseBusinessIcon
        />
      ),
    },
    {
      title: "Pengurus",
      url: "/pengurus",
      icon: (
        <UsersIcon
        />
      ),
    },
    {
      title: "Testimoni",
      url: "/testimoni",
      icon: (
        <MessageSquareQuoteIcon
        />
      ),
    },
    {
      title: "Pengaturan",
      url: "/pengaturan",
      icon: (
        <Settings2Icon
        />
      ),
    },
  ],
  projects: [
    {
      name: "Agenda Kegiatan",
      url: "/agenda",
      icon: (
        <CalendarDaysIcon
        />
      ),
    },
    {
      name: "Anggota",
      url: "/anggota",
      icon: (
        <UsersIcon
        />
      ),
    },
  ],
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
