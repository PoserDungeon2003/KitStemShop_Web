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
  fullName?: string;
  phone?: string;
  address?: string;
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
  status?: 'Active' | 'Inactive' | undefined
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
  kits?: KitItem[]; // Adjust the type of kits if you have a more specific structure
  lab?: LabDetail | null; // Adjust the type of lab if you have a more specific structure
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
  // status?: 'Active' | 'Inactive' | undefined
};

export type LabDetailResponse = {
  isSuccess: boolean;
  statusCode: number;
  message?: string | null;
  data?: LabDetail;
};

export type Item = {
  istemId: number;
  istemName: string;
  warrantyMonths: number;
  img?: string;
  kitId: number;
  price: number;
  stock: number;
  kit?: KitItem | null; // Adjust the type of kit if you have a more specific structure
  orderDetails: any[]; // Adjust the type of orderDetails if you have a more specific structure
};

export type ItemsResponse = {
  isSuccess: boolean;
  statusCode: number;
  message?: string | null;
  data?: Item[];
};

export type CategoryCompos = {
  categoryCompoId: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
  compos: ComboLabKit[];
};

export type CategoryComposResponse = {
  isSuccess: boolean;
  statusCode: number;
  message?: string | null;
  data?: CategoryCompos[];
};

export type Lab = {
  labId: number;
  labName: string;
  labDescription: string;
  videoUrl: string;
  categoryLabId: number;
  status: string;
  categoryLab: any | null; // Adjust the type of categoryLab if you have a more specific structure
  compos: ComboLabKit[]; // Adjust the type of compos if you have a more specific structure
  orders: any[]; // Adjust the type of orders if you have a more specific structure
  supportRequests: any[]; // Adjust the type of supportRequests if you have a more specific structure
};

export type LabsResponse = {
  isSuccess: boolean;
  statusCode: number;
  message?: string | null;
  data?: Lab[];
};

export type CreateCombo = {
  labKitName: string;
  labKitDescription: string;
  image: string;
  price: number;
  labId: number;
  categoryCompoId: number;
};

export type UpdateComboRQ = {
  price: number;
  labKitName?: string;
  labKitDescription?: string;
  image?: string;
}

export type Kit = {
  kitName: string;
  createdAt: string;
  comboName: string;
  compoId: number;
};

export type KitResponse = {
  isSuccess: boolean;
  statusCode: number;
  message?: string | null;
  data?: Kit;
};

export type UpdateKitRQ = {
  kitName: string;
  compoId: number;
}

export type CreateKitRQ = {
  kitName: string;
  compoId: number;
}

export type UpdateLabRQ = {
  labName: string;
  labDescription: string;
  videoUrl: string;
}

export type CreateLabRQ = {
  labName: string;
  labDescription: string;
  videoUrl: string;
  categoryLabId: number;
}