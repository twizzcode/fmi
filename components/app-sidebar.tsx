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
  GalleryVerticalEndIcon,
  HomeIcon,
  ImageIcon,
  MessageSquareQuoteIcon,
  NewspaperIcon,
  UserIcon,
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
      url: "/admin/berita",
      icon: (
        <NewspaperIcon
        />
      ),
    },
    {
      title: "Galeri",
      url: "/admin/galeri",
      icon: (
        <ImageIcon
        />
      ),
    },
    {
      title: "Testimoni",
      url: "/admin/testimoni",
      icon: (
        <MessageSquareQuoteIcon
        />
      ),
    },
  ],
  navFeature: [
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
      title: "Anggota",
      url: "/anggota",
      icon: (
        <UsersIcon
        />
      ),
    },
  ],
  navAccount: [
    {
      title: "My Account",
      url: "/my-account",
      icon: (
        <UserIcon
        />
      ),
    },
  ],
  projects: [
    {
      name: "Berita",
      url: "/berita",
      icon: (
        <NewspaperIcon
        />
      ),
    },
    {
      name: "Galeri",
      url: "/galeri",
      icon: (
        <ImageIcon
        />
      ),
    },
    {
      name: "Testimoni",
      url: "/testimoni",
      icon: (
        <MessageSquareQuoteIcon
        />
      ),
    },
  ],
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  const canSeeAdminSections = user.role === "admin" || user.role === "developer"
  const canSeeWorkplaceSections =
    user.role === "staff" ||
    user.role === "alumni" ||
    user.role === "admin" ||
    user.role === "developer"

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        {canSeeAdminSections ? <NavMain items={data.navMain} /> : null}
        {canSeeAdminSections ? <NavMain items={data.navFeature} label="Feature" /> : null}
        {canSeeWorkplaceSections ? <NavProjects projects={data.projects} /> : null}
        <NavMain items={data.navAccount} label="Account" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
