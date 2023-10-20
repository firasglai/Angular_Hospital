export interface Profile {
  id?: string;
  fullName?: string;
  email: string;
  //to check images outputs
  profileImage?: Blob;
  password: string;
  userRole?: string;
  enabled?: boolean;
  username?: string;
  authorities?: { authority: string }[];
  accountNonExpired?: boolean;
  credentialsNonExpired?: boolean;
  accountNonLocked?: boolean;
}
