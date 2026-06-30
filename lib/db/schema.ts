import { relations } from "drizzle-orm"
import { boolean, index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core"

export const roleValues = ["user", "staff", "admin", "developer", "alumni"] as const
export type UserRole = (typeof roleValues)[number]
export const testimonialStatusValues = ["pending", "approved", "rejected"] as const
export type TestimonialStatus = (typeof testimonialStatusValues)[number]
export const newsStatusValues = ["draft", "published"] as const
export type NewsStatus = (typeof newsStatusValues)[number]
export const galleryStatusValues = ["pending", "approved", "rejected"] as const
export type GalleryStatus = (typeof galleryStatusValues)[number]
export const structureGenderValues = ["ikhwan", "akhwat"] as const
export type StructureGender = (typeof structureGenderValues)[number]

export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  uploadedImagePath: text("uploaded_image_path"),
  role: text("role", { enum: roleValues }).notNull().default("user"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
})

export const sessions = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId)]
)

export const accounts = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("account_user_id_idx").on(table.userId)]
)

export const verifications = pgTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
)

export const testimonials = pgTable(
  "testimonial",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    designation: text("designation").notNull(),
    quote: text("quote").notNull(),
    imagePath: text("image_path").notNull(),
    status: text("status", { enum: testimonialStatusValues }).notNull().default("pending"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("testimonial_created_at_idx").on(table.createdAt),
    index("testimonial_status_idx").on(table.status),
    index("testimonial_user_id_idx").on(table.userId),
  ]
)

export const services = pgTable(
  "service",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    buttonLabel: text("button_label").notNull(),
    href: text("href").notNull(),
    imagePath: text("image_path").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [index("service_sort_order_idx").on(table.sortOrder)]
)

export const newsArticles = pgTable(
  "news_article",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    excerpt: text("excerpt").notNull(),
    category: text("category").notNull(),
    author: text("author").notNull(),
    imagePath: text("image_path").notNull(),
    bodyJson: text("body_json").notNull(),
    status: text("status", { enum: newsStatusValues }).notNull().default("draft"),
    views: integer("views").notNull().default(0),
    publishedAt: timestamp("published_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("news_article_published_at_idx").on(table.publishedAt),
    index("news_article_slug_idx").on(table.slug),
    index("news_article_user_id_idx").on(table.userId),
  ]
)

export const galleryEntries = pgTable(
  "gallery_entry",
  {
    id: text("id").primaryKey(),
    userId: text("user_id").references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    storagePath: text("storage_path").notNull().unique(),
    eventDate: timestamp("event_date").notNull(),
    status: text("status", { enum: galleryStatusValues }).notNull().default("pending"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("gallery_entry_event_date_idx").on(table.eventDate),
    index("gallery_entry_storage_path_idx").on(table.storagePath),
    index("gallery_entry_status_idx").on(table.status),
    index("gallery_entry_user_id_idx").on(table.userId),
  ]
)

export const galleryPhotos = pgTable(
  "gallery_photo",
  {
    id: text("id").primaryKey(),
    galleryEntryId: text("gallery_entry_id")
      .notNull()
      .references(() => galleryEntries.id, { onDelete: "cascade" }),
    storagePath: text("storage_path").notNull().unique(),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("gallery_photo_entry_id_idx").on(table.galleryEntryId),
    index("gallery_photo_sort_order_idx").on(table.sortOrder),
    index("gallery_photo_storage_path_idx").on(table.storagePath),
  ]
)

export const structureCabinets = pgTable(
  "structure_cabinet",
  {
    id: text("id").primaryKey(),
    orderLabel: text("order_label").notNull(),
    name: text("name").notNull(),
    theme: text("theme").notNull().default(""),
    philosophy: text("philosophy").notNull().default(""),
    logoPath: text("logo_path").notNull().default(""),
    isDefault: boolean("is_default").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("structure_cabinet_created_at_idx").on(table.createdAt),
    index("structure_cabinet_is_default_idx").on(table.isDefault),
  ]
)

export const structureMembers = pgTable(
  "structure_member",
  {
    id: text("id").primaryKey(),
    cabinetId: text("cabinet_id")
      .notNull()
      .references(() => structureCabinets.id, { onDelete: "cascade" }),
    department: text("department").notNull(),
    name: text("name").notNull(),
    nickname: text("nickname").notNull().default(""),
    position: text("position").notNull(),
    program: text("program").notNull(),
    entryYear: text("entry_year").notNull(),
    gender: text("gender", { enum: structureGenderValues })
      .notNull()
      .default("ikhwan"),
    quote: text("quote").notNull().default(""),
    photoPath: text("photo_path").notNull().default(""),
    instagram: text("instagram").notNull().default(""),
    linkedin: text("linkedin").notNull().default(""),
    github: text("github").notNull().default(""),
    website: text("website").notNull().default(""),
    tiktok: text("tiktok").notNull().default(""),
    youtube: text("youtube").notNull().default(""),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("structure_member_cabinet_id_idx").on(table.cabinetId),
    index("structure_member_department_idx").on(table.department),
    index("structure_member_created_at_idx").on(table.createdAt),
  ]
)

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
}))

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
}))

export const structureCabinetsRelations = relations(
  structureCabinets,
  ({ many }) => ({
    members: many(structureMembers),
  })
)

export const structureMembersRelations = relations(
  structureMembers,
  ({ one }) => ({
    cabinet: one(structureCabinets, {
      fields: [structureMembers.cabinetId],
      references: [structureCabinets.id],
    }),
  })
)
