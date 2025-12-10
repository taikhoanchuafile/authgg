import {
  GoogleLogin,
  GoogleOAuthProvider,
  type CredentialResponse,
} from "@react-oauth/google";
import { useGoogleAuthStore } from "../stores/useGoogleAuthStore";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const googleLogin = useGoogleAuthStore((state) => state.googleLogin);
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    const credential = credentialResponse.credential;
    await googleLogin(credential!);
    navigate("/");
  };
  return (
    <div className="max-w-xs">
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.log("GG login fail")}
        />
      </GoogleOAuthProvider>
    </div>
  );
};

export default LoginPage;
