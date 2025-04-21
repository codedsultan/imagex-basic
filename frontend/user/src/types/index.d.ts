import { z } from 'zod';

// export type PageProps<
//     T extends Record<string, unknown> = Record<string, unknown>,
// > = T & {
//     auth: {
//         user: User;
//     };
// };
export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & z.infer<typeof PagePropsSchema>;
export interface MediaItem {
    id: number;
    model_type: string;
    model_id: number;
    collection_name: string;
    name: string;
    file_name: string;
    mime_type: string;
    disk: string;
    size: number;
    manipulations: Record<string, any>;
    custom_properties: Record<string, any>;
    responsive_images: Record<string, any>;
    order_column: number;
    created_at: string;
    updated_at: string;
    original_url: string;
    preview_url: string;
  }


  const NotificationsSchema = z.array(
    z.object({
      id:       z.number(),
      title:    z.string(),
      message:  z.string(),
      type:     z.string(),
      unread:   z.boolean(),
      details:  z.string().optional(),
    })
  ).nullable();


  export const UserSchema = z.object({
    id:               z.number(),
    name:             z.string(),
    email:            z.string().email(),
    email_verified_at: z.string().nullable().optional(),
    created_at:       z.string(),
    updated_at:       z.string(),
    remember_token:   z.string().nullable().optional(),
    avatar:           z.string().nullable().optional(),
    timezone:         z.string().nullable().optional(),
  });


  export type User = z.infer<typeof UserSchema>;

//   const AuthSchema = z.object({
//     user: UserSchema.nullable(),  // nullable if guest users are allowed
//   });


//   export interface User {
//     id: number;
//     name: string;
//     email: string;
//     email_verified_at?: string;
//   }

  const ZiggySchema = z.object({
    base_url: z.string(),
    location: z.string(),
    query: z.record(z.string(), z.unknown()),
  });

  const FlashSchema = z.object({
    status:  z.string(),
    message: z.string().nullable(),
    title:   z.string().nullable(),
    success: z.any().nullable(),
    meta:    z.any().nullable(),
  });

// Main PageProps schema
const PagePropsSchema = z.object({
    errors: z.record(z.unknown()),
    jetstream: JetstreamSchema,
    auth: {
        user: z.union([
        UserSchema
    ]).nullable()},
    // auth: AuthSchema,
    errorBags: z.array(z.unknown()),
    ziggy: ZiggySchema,
    flash: FlashSchema,
    notifications: NotificationsSchema,
});



export type PaginationData = {
    links: {
      url: string;
      label: string;
      active: boolean;
    }[];
    total: number;
    from: number;
    to: number;
    current_page: number;
    per_page: number;
    last_page: number;
    first_page_url: string;
    last_page_url: string;
    next_page_url: string;
    prev_page_url: string;
    path: string;
  }

  export type PaginatedResponse<T> = {
    data: T[];
  } & PaginationData
// frontend/user/src/types/index.ts
export * from './mockup';
export * from './design';
// export * from './mockup-templates';
// export * from './design-templates';
export * from './editor';
