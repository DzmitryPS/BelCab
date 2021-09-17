export interface DefaultDocumentData {
    id: number;
  }

  export interface UserData {
    id: number;
    name?: string;
    address?: string;
    phoneNumber?: string;
    email: string;
    isSubscribed?: boolean;
  }