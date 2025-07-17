export interface ClerkUser {
  id: string;
  firstName?: string;
  lastName?: string;
  emailAddresses: Array<{
    emailAddress: string;
    id: string;
  }>;
  imageUrl?: string;
  createdAt: number;
  lastSignInAt?: number;
  banned: boolean;
  locked: boolean;
  publicMetadata?: {
    role?: string;
    [key: string]: unknown;
  };
}

export interface UserListResponse {
  users: ClerkUser[];
  totalCount: number;
  hasMore: boolean;
}

export interface UserFilters {
  search?: string;
  page?: number;
  limit?: number;
  orderBy?: "created_at" | "last_sign_in_at" | "email_address";
  order?: "asc" | "desc";
  role?: string; // Filter by user role
}
