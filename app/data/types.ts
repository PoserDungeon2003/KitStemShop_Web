export type LoginRS = {
  token: string;
  isSuccess: boolean;
  statusCode: number;
  message: string;
  data?: User;
}

export type User = {
  token?: string;
  role?: string;
}

export type UserProfile = {
  user?: User;
  detail?: UserDetail;
}

export type UserDetail = {
  username?: string;
  userId: number;
  userName?: string;
  role?: string;
  email?: string;
  fullName?: string;
  phone?: string;
  address?: string;
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

export type SupportRequest = {
  supportRequestId: number;
  userId?: number;
  LabId?: number;
  supportCount?: number;
  MaxSupportCount?: number;
  lastSupportDate?: Date;
  requestTitle?: string;
  requestDescription?: string;
  status: string;
  lab?: LabDetail | null;
  manager?: any;
  user?: any;
  managerId?: number;
  Status?: string;
}

export type SupportRequestResponse = {
  isSuccess: boolean;
  statusCode: number;
  message?: string | null;
  data?: SupportRequest[];
}

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

export type ItemDetail = {
  istemName: string;
  warrantyMonths: number;
  img: string;
  kitName: string;
  price: number;
  stock: number;
};

export type ItemDetailResponse = {
  isSuccess: boolean;
  statusCode: number;
  message?: string | null;
  data?: ItemDetail;
};

export type UpdateItemRQ = {
  istemName: string;
  warrantyMonths: number;
  img: string;
  price: number;
  stock: number;
  kitId: number;
}

export type CreateItemRQ = {
  istemName: string;
  warrantyMonths: number;
  img: string;
  kitId: number;
  price: number;
  stock: number;
}

export type CategoryLab = {
  categoryLabId: number;
  categoryLabName: string;
  createdAt?: string | null;
  updatedAt?: string | null;
  labs: Lab[];
};

export type CategoryLabResponse = {
  isSuccess: boolean;
  statusCode: number;
  message?: string | null;
  data?: CategoryLab[];
};

export type RegisterForm = {
  fullName: string;
  userName: string;
  passwordHash: string;
  confirmPassword: string;
  email: string;
  address: string;
  phone: string;
}

export type WhiteListClient = {
  From: any[];
  To: any[];
  Return: any[];
};

export type WhiteListDistrict = {
  From: any | null;
  To: any | null;
};

export type District = {
  DistrictID: number;
  ProvinceID: number;
  DistrictName: string;
  Type: number;
  SupportType: number;
  NameExtension: string[];
  CanUpdateCOD: boolean;
  Status: number;
  PickType: number;
  DeliverType: number;
  WhiteListClient: WhiteListClient;
  WhiteListDistrict: WhiteListDistrict;
  ReasonCode: string;
  ReasonMessage: string;
  OnDates: any | null;
  CreatedIP: string;
  CreatedEmployee: number;
  CreatedSource: string;
  CreatedDate: string;
  UpdatedIP: string;
  UpdatedEmployee: number;
  UpdatedSource: string;
  UpdatedDate: string;
};

export type DistrictResponse = {
  code: number;
  message: string;
  data: District[];
};

export type WhiteListWard = {
  From: any | null;
  To: any | null;
};

export type Ward = {
  WardCode: string;
  DistrictID: number;
  WardName: string;
  NameExtension: string[];
  IsEnable: number;
  CanUpdateCOD: boolean;
  UpdatedBy: number;
  CreatedAt: string;
  UpdatedAt: string;
  SupportType: number;
  PickType: number;
  DeliverType: number;
  WhiteListClient: WhiteListClient;
  WhiteListWard: WhiteListWard;
  Status: number;
  ReasonCode: string;
  ReasonMessage: string;
  OnDates: any | null;
  UpdatedEmployee: number;
  UpdatedDate: string;
};

export type WardResponse = {
  code: number;
  message: string;
  data: Ward[];
};

export type Province = {
  ProvinceID: number;
  ProvinceName: string;
  CountryID: number;
  Code: string;
  NameExtension: string[];
  IsEnable: number;
  RegionID: number;
  RegionCPN: number;
  UpdatedBy: number;
  CreatedAt: string;
  UpdatedAt: string;
  AreaID: number;
  CanUpdateCOD: boolean;
  Status: number;
  UpdatedIP: string;
  UpdatedEmployee: number;
  UpdatedSource: string;
  UpdatedDate: string;
};

export type ProvinceResponse = {
  code: number;
  message: string;
  data: Province[];
};

export type NotificationType = 'success' | 'info' | 'warning' | 'error';

export type Blog = {
  blogId: number;
  title: string;
  content: string;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  status: string;
  image: string;
  category: any | null; // Adjust the type if you have a more specific structure for category
  user: any | null; // Adjust the type if you have a more specific structure for user
};

export type BlogsResponse = {
  isSuccess: boolean;
  statusCode: number;
  message: string | null;
  data: Blog[];
};

export type BlogDetail = {
  title: string;
  content: string;
  categoryName: string;
  userName: string;
};

export type BlogDetailResponse = {
  isSuccess: boolean;
  statusCode: number;
  message: string | null;
  data: BlogDetail;
};

export type UpdateBlogRQ = {
  content: string;
  categoryId: number;
}

export type BlogCategory = {
  categoryId: number;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
};

export type BlogCategoriesResponse = {
  isSuccess: boolean;
  statusCode: number;
  message: string | null;
  data: BlogCategory[];
};

export type CreateBlogRQ = {
  title: string;
  content: string;
  categoryId: number;
  image: {
    file: File;
    fileList: FileList;
  };
}

export type CreateCategoryRQ = {
  categoryName: string;
}

export type UpdateCategoryComboRQ = {
  categoryName: string;
}

export type UpdateCategoryBlogRQ = {
  categoryName: string;
}

export type UpdateCategoryLabRQ = {
  categoryLabName: string;
}

export type OrderDetailDTO = {
  labKitId: number;
  iStemId: number;
};

export type Cart = {
  usertID?: number;
  totalPrice: number;
  orderDetailsDTO: OrderDetailDTO[];
};

export type CartResponse = {
  message: string;
  cartItems: Cart[];
};

export type OrderDetail = {
  orderDetailsId: number;
  iStemId: number | null;
  compoId: number;
  price: number;
  warrantyStartDate: string | null;
  warrantyEndDate: string | null;
  status: string;
};

export type Order = {
  orderId: number;
  userId: number;
  orderDate: string;
  totalAmount: number;
  statusPayment: string;
  statusLabActive: string;
  labId: number;
  lab: Lab | null; // Adjust the type if you have a more specific structure for lab
  orderDetails: OrderDetail[];
  user: any | null; // Adjust the type if you have a more specific structure for user
};

export type OrderData = {
  userID: number;
  totalPrice: number;
  orderDate: string;
  statusLabActive: string;
  paymentStatus: string;
  details: OrderDetail[];
};

export type OrderDataResponse = {
  status: number;
  message: string;
  data: OrderData;
};

export type OrdersResponse = {
  status: number;
  message: string;
  data: Order[];
};

export type CreateOrderRQ = {
  statusPayment: string;
  orderDetailsDTO: OrderDetailDTO[];
};

export type CreateOrderResponse = {
  status: number;
  message: string;
  data: Order;
};

export type VnPayPaymentRS = {
  status: number;
  message: string;
  data: string;
};

export type VnPayResponse = {
  bankTranNo: string;
  payDate: string;
  orderInfo: string;
  responseCode: string;
  transactionId: string;
  transactionStatus: string;
  cardType: string;
  txnRef: string;
  amount: number;
  bankCode: string;
};

export type VnPayCallbackData = {
  responseCodeMessage: string;
  transactionStatusMessage: string;
  vnPayResponse: VnPayResponse;
};

export type VnPayCallbackResponse = {
  status: number;
  message: string;
  data: VnPayCallbackData;
};

export type RemoveFromCartRS = {
  message: string;
  cartItems: Cart[];
}

export type createSupportRequestRS = {
  data: SupportRequest;
  message: string;
  status: number;
}