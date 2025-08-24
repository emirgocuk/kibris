import { useEffect } from "react";
import { Formik, Form, Field } from "formik";
import { post, get } from "~/requests";
import { useNavigate } from "react-router-dom";

export default () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem("token");
            if (!token) return; // Token yoksa login sayfasında kal

            try {
                // Token geçerli mi kontrol et
                const userData = await get<{ user: any }>("/auth", {
                    Authorization: `Bearer ${token}`,
                });

                // Kullanıcı geçerli ise panel sayfasına yönlendir
                if (userData.user) {
                    navigate("/girne/panel");
                } else {
                    localStorage.removeItem("token");
                }
            } catch (err) {
                console.error(err);
                localStorage.removeItem("token"); // Geçersiz token ise temizle
            }
        };

        checkToken();
    }, [navigate]);

    return (
        <div className="flex-1 h-screen flex items-center justify-center ">
            <div className="bg-gray-50 border-2 border-gray-300 mx-auto py-4 px-4 rounded-xl flex flex-col gap-2">
                <Formik
                    initialValues={{ email: "", password: "" }}
                    onSubmit={async (values) => {
                        try {
                            const data = await post("/auth/login", values);
                            const res = data as { token: string };

                            localStorage.setItem("token", res.token);
                            navigate("/girne/panel");
                        } catch (err) {
                            console.log(err);
                            alert("Giriş Yapılamadı");
                        }
                    }}
                >
                    {() => (
                        <Form className="flex flex-col gap-3">
                            <Field
                                id="email"
                                name="email"
                                placeholder="E-posta"
                                type="email"
                                className="border p-2 rounded"
                            />
                            <Field
                                id="password"
                                name="password"
                                placeholder="Şifre"
                                type="password"
                                className="border p-2 rounded"
                            />

                            <button
                                type="submit"
                                className="bg-red-500 text-white p-2 rounded cursor-pointer"
                            >
                                Gönder
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};
