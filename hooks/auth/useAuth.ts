import { useLogin } from "./useLogin";
import { useProfile } from "./useProfile";
import { useRegister } from "./useRegister";
import { useUploadAvatar } from "./useUploadAvatar";

export const useAuth = () => {
  return {
    ...useLogin(),
    ...useRegister(),
    ...useProfile(),
    ...useUploadAvatar()
  };
};
