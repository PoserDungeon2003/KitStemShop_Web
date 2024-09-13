export type LoginRS = {
  token: string;
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data?: User;
}

export type User = {
  token?: string;
  userId: number;
  userName?: string;
  role?: string;
  email?: string;
}

export type UserProfile = {
  user?: User;
  detail?: UserDetail;
}

export type UserDetail = {
  username?: string;
  roles?: string[];
}