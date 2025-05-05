import { IAuthUser } from "src/features/auth/interfaces/auth.interface";

export interface IReduxState {
  authUser: IAuthUser; // update this to the correct type for your auth user
  header: string;
  logout: boolean;
  buyer: object; // update this to the correct type for your buyer
  seller: object; // update this to the correct type for your seller
  showCategoryContainer: boolean;
  notification: object; // update this to the correct type for your notification
}
