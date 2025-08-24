import { useState, useEffect, type ChangeEvent, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { get, post, put, del } from "~/requests";
import { AiFillFileImage } from "react-icons/ai";
import Editor from "~/components/Editor";

type User = {
    id: number;
    name: string;
    email: string;
    roleId: number;
    avatar?: string;
    bio?: string;
};

type Role = {
    id: number;
    name: string;
};

export default function UserManager() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const token = localStorage.getItem("token") || "";

    const [users, setUsers] = useState<User[]>([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<number>(0);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [avatar, setAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>("");

    const [roles, setRoles] = useState<Role[]>([]);
    const [bio, setBio] = useState(""); // Editor için bio
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Roller
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const data = await get<{ roles: Role[] }>("/role/", { Authorization: `Bearer ${token}` });
                setRoles(Array.isArray(data.roles) ? data.roles : []);
            } catch (err) {
                console.error("Roller alınamadı:", err);
            }
        };
        fetchRoles();
    }, [token]);

    // Düzenleme modunu aç
    useEffect(() => {
        if (id) {
            const fetchUser = async () => {
                try {
                    const data = await get<User>(`/user/${id}`, { Authorization: `Bearer ${token}` });
                    setName(data.name);
                    setEmail(data.email);
                    setRole(data.roleId);
                    setEditingId(data.id);
                    setBio(data.bio || "");
                    if (data.avatar) setAvatarPreview(data.avatar);
                } catch (err) {
                    console.error(err);
                }
            };
            fetchUser();
        } else {
            handleClear();
        }
    }, [id, token]);

    // Kullanıcıları listele
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await get<{ users: User[] }>("/user/", { Authorization: `Bearer ${token}` });
                setUsers(Array.isArray(data.users) ? data.users : []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUsers();
    }, [token]);

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setAvatar(e.target.files[0]);
            setAvatarPreview(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleSubmit = async () => {
        if (!name.trim() || !email.trim() || !role || (!editingId && !password.trim())) {
            return alert("Tüm alanlar doldurulmalı!");
        }

        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("role", String(role));
            formData.append("biography", bio); // Editor içeriği
            if (!editingId || password.trim()) formData.append("password", password);
            if (avatar) formData.append("photo", avatar);

            if (editingId) {
                await put(`/user/${editingId}`, formData, { headers: { Authorization: `Bearer ${token}` }, isFormData: true });
                alert("Kullanıcı güncellendi!");
            } else {
                await post("/user/", formData, { headers: { Authorization: `Bearer ${token}` }, isFormData: true });
                alert("Kullanıcı oluşturuldu!");
            }

            navigate("/girne/panel/kullanici");
        } catch (err) {
            console.error(err);
            alert("İşlem başarısız!");
        }
    };

    const handleClear = () => {
        setName("");
        setEmail("");
        setPassword("");
        setRole(0);
        setEditingId(null);
        setAvatar(null);
        setAvatarPreview("");
        setBio("");
    };

    const handleDelete = async (userId: number) => {
        if (!token) return alert("Giriş yapılmamış!");
        if (!window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;
        try {
            await del(`/user/${userId}`, { Authorization: `Bearer ${token}` });
            setUsers((prev) => prev.filter((u) => u.id !== userId));
        } catch (err) {
            console.error(err);
            alert("Silme işlemi başarısız!");
        }
    };

    const handleEditRedirect = (userId: number) => {
        navigate(`/girne/panel/kullanici/${userId}`);
    };

    return (
        <>
            <span className="text-2xl font-bold">{editingId ? "Kullanıcı Düzenle" : "Yeni Kullanıcı"}</span>
            <div className="grid grid-cols-[auto_1fr] gap-4 mt-2">
                <div
                    className="aspect-square h-32 border-2 border-dashed border-stone-400 rounded-full flex items-center justify-center overflow-hidden cursor-pointer"
                    onClick={handleAvatarClick}
                >
                    {avatarPreview ? (
                        <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                        <AiFillFileImage className="bg-stone-400 p-2 rounded-full text-lg box-content text-stone-50" />
                    )}
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" />
                </div>
                <div className="flex flex-col gap-2 justify-center">
                    <span>Kullanıcı Adı</span>
                    <input type="text" placeholder="Kullanıcı İsmi" value={name} onChange={(e) => setName(e.target.value)} className="border px-2 py-1 rounded" />

                    <span>Email</span>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border px-2 py-1 rounded" />

                    <span>Şifre {editingId ? "(Değiştirmek için giriniz)" : ""}</span>
                    <input type="password" placeholder={editingId ? "Yeni şifre" : "Şifre"} value={password} onChange={(e) => setPassword(e.target.value)} className="border px-2 py-1 rounded" />

                    <span>Rol</span>
                    <select value={role} onChange={(e) => setRole(parseInt(e.target.value))} className="border px-2 py-1 rounded">
                        <option value={0}>Rol Seçiniz</option>
                        {roles.map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>

                    <span>Biyografi</span>
                    <Editor setContent={setBio} content={bio} />
                </div>
            </div>

            <div className="flex w-full gap-2 justify-end mt-2">
                <button onClick={handleClear} className="px-4 py-1 border rounded">Temizle</button>
                <button onClick={handleSubmit} className="px-4 py-1 border rounded bg-blue-500 text-white">{editingId ? "Güncelle" : "Gönder"}</button>
            </div>

            <span className="text-2xl font-bold mt-4">Mevcut Kullanıcılar</span>
            <ul className="divide-y divide-stone-400">
                {users.map((user) => (
                    <li key={user.id} className="flex justify-between items-center py-2">
                        <div className="flex items-center gap-2">
                            {user.avatar && <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />}
                            <span>{user.name}</span>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={() => handleEditRedirect(user.id)} className="px-2 py-1 border rounded">Düzenle</button>
                            <button onClick={() => handleDelete(user.id)} className="px-2 py-1 border rounded">Sil</button>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    );
}
