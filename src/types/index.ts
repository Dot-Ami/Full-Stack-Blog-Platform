// ============================================
// USER TYPES
// ============================================
export interface User {
  id: string;
  email: string;
  username: string;
  name: string | null;
  bio: string | null;
  image: string | null;
  createdAt: Date;
}

export interface UserWithPosts extends User {
  posts: PostPreview[];
  _count: {
    posts: number;
  };
}

export interface AuthUser {
  id: string;
  email: string;
  username: string;
  name: string | null;
  image: string | null;
}

// ============================================
// POST TYPES
// ============================================
export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featuredImage: string | null;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
}

export interface PostWithAuthor extends Post {
  author: User;
}

export interface PostWithDetails extends PostWithAuthor {
  categories: Category[];
  comments: CommentWithAuthor[];
  _count: {
    comments: number;
  };
}

export interface PostPreview {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  featuredImage: string | null;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  author: {
    id: string;
    name: string | null;
    username: string;
    image: string | null;
  };
  categories: Category[];
  _count: {
    comments: number;
  };
  /** Calculated reading time in minutes */
  readingTime?: number;
}

// ============================================
// CATEGORY TYPES
// ============================================
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

// ============================================
// COMMENT TYPES
// ============================================
export interface Comment {
  id: string;
  content: string;
  deleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  postId: string;
  parentId: string | null;
}

export interface CommentWithAuthor extends Comment {
  author: {
    id: string;
    name: string | null;
    username: string;
    image: string | null;
  };
  /** Flag to trigger fade-out animation after deletion */
  isDeleting?: boolean;
}

export interface CommentWithReplies extends CommentWithAuthor {
  replies: CommentWithAuthor[];
}

// ============================================
// API RESPONSE TYPES
// ============================================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// ============================================
// FORM TYPES
// ============================================
export interface CreatePostInput {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  published?: boolean;
  categoryIds?: string[];
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  id: string;
}

export interface CreateCommentInput {
  content: string;
  postId: string;
  parentId?: string;
}

export interface RegisterInput {
  email: string;
  username: string;
  password: string;
  name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface UpdateUserInput {
  name?: string;
  bio?: string;
  image?: string;
}

