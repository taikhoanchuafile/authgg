import { toast } from "react-toastify";
import api from "../api/axios";
import { useGoogleAuthStore } from "../stores/useGoogleAuthStore";

const Home = () => {
  const logout = useGoogleAuthStore((state) => state.logout);
  const user = useGoogleAuthStore((state) => state.user);

  const handleTest = async () => {
    try {
      await api.get("/users/test");
      toast.success("Access token vẫn còn");
    } catch (error) {
      console.error(error);
      toast.error("Access token hết hạn");
    }
  };
  const handleLogout = async () => {
    await logout();
    toast.success("Đăng xuất thành công");
  };

  return (
    <div>
      Home
      <div>tên user: {user?.name}</div>
      <br />
      <button
        className="px-4 py-2 bg-green-500 border border-green-800 rounded-2xl hover:bg-green-300"
        onClick={handleTest}
        type="button"
      >
        Test Token
      </button>
      <br />
      <button
        className="px-4 py-2 bg-red-500 border border-green-800 rounded-2xl hover:bg-green-300"
        onClick={handleLogout}
        type="button"
      >
        Đăng xuất
      </button>
    </div>
  );
};

export default Home;
