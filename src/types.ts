export interface DefaultDocumentData {
    id: number;
  }

  export interface UserData {
    id: number;
    firstName?: string;
    lastName?: string;
    address?: string;
    phoneNumber?: string;
    email: string;
    isAdmin?: boolean;
  }