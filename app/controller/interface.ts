export interface InterfaceRegister {
  name: string;
  email: string;
  password: string;
}

export interface InterfaceLogin {
  email: string;
  password: string;
}

export interface InterfacePost {
  title: string;
  description: string;
  user_id: number;
}

export interface InterfaceLike {
  quantity: number;
  post_id: number;
}

export interface Users {
  id: number;
  name: string;
}