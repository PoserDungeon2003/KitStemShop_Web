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

export type KitItem = {
  kitId: number;
  kitName: string;
  createdAt?: string;
  updatedAt?: string;
  compoId: number;
  compo?: string | null;
  istems: any[];
};

export type KitsResponse = {
  isSuccess: boolean;
  statusCode: number;
  message?: string | null;
  data?: KitItem[];
};

export type ComboLabKit = {
  compoId: number;
  labId: number;
  price: number;
  labKitName: string;
  labKitDescription: string;
  image?: string;
  categoryCompoId: number;
  categoryCompo?: string | null;
  kits?: any[]; // Adjust the type of kits if you have a more specific structure
  lab?: any | null; // Adjust the type of lab if you have a more specific structure
  orderDetails?: any[]; // Adjust the type of orderDetails if you have a more specific structure
};

export type ComboLabKitsResponse = {
  isSuccess: boolean;
  statusCode: number;
  message: string | null;
  data?: ComboLabKit[];
};

export type ComboLabKitDetail = {
  labKitName: string;
  labKitDescription: string;
  price: number;
  image?: string;
  categoryName: string;
  labName: string;
  labId: number;
};

export type ComboLabKitDetailResponse = {
  isSuccess: boolean;
  statusCode: number;
  message?: string | null;
  data?: ComboLabKitDetail;
};

export type LabDetail = {
  labId: number;
  labName: string;
  labDescription: string;
  videoUrl: string;
  categoryLabName: string;
};

export type LabDetailResponse = {
  isSuccess: boolean;
  statusCode: number;
  message: string | null;
  data: LabDetail;
};