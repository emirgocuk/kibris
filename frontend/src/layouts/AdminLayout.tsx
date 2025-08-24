import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { get } from "~/requests";
import PanelHeader from "~/components/PanelHeader";

export default () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/girne"); // Token yoksa login sayfasına yönlendir
                return;
            }

            try {
                // Token geçerli mi kontrol et
                const userData = await get<{ user: any }>("/auth", {
                    Authorization: `Bearer ${token}`,
                });

                if (!userData.user) {
                    localStorage.removeItem("token"); // Geçersiz token ise sil
                    navigate("/login");
                }
            } catch (err) {
                console.error(err);
                localStorage.removeItem("token"); // Hata varsa token sil
                navigate("/login");
            }
        };

        checkToken();
    }, [navigate]);

    return (
        <div className="flex min-h-screen divide-x-2 divide-stone-400">
            <PanelHeader />
            <div className="flex flex-col w-5/6 gap-3 px-4 py-3 ml-64">
                <Outlet />
            </div>
        </div>
    );
};
