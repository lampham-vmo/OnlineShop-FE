// constants/roles.ts
export const Roles = {
  ADMIN: 1,
  MODERATOR: 3,
  USER: 2,
} as const;

export type RoleKey = keyof typeof Roles;
export type RoleId = (typeof Roles)[RoleKey];
