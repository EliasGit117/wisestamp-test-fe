
export enum UserRole {
  user = 'user',
  admin = 'admin'
}

export enum UserStatus {
  active = 'active',
  inactive = 'inactive'
}

export interface IUserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  created: string;
  updated: string;
}