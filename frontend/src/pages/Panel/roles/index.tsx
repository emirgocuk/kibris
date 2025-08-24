import { useEffect, useState } from "react";
import { get, del, put, post } from "~/requests";
import Checkbox from "~/components/Checkbox"; // Controlled animasyonlu checkbox

type Role = {
    id: number;
    name: string;
    canManagePages: boolean;
    canCreateNews: boolean;
    canEditNews: boolean;
    canDeleteNews: boolean;
    canCreateBook: boolean;
    canEditBook: boolean;
    canDeleteBook: boolean;
    canApprovePost: boolean;
    canManageAnnouncements: boolean;
    canManageUsers: boolean;
    canManageRoles: boolean;
    canManageGallery: boolean;
    canManageSlider: boolean;
};

export default function RolePage() {
    const [roles, setRoles] = useState<Role[]>([]);
    const [newRole, setNewRole] = useState<Partial<Role>>({
        name: "",
        canManagePages: false,
        canCreateNews: false,
        canEditNews: false,
        canDeleteNews: false,
        canCreateBook: false,
        canEditBook: false,
        canDeleteBook: false,
        canApprovePost: false,
        canManageAnnouncements: false,
        canManageUsers: false,
        canManageRoles: false,
        canManageGallery: false,
        canManageSlider: false,
    });

    const token = localStorage.getItem("token") || "";

    // Roller çek
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const data = await get<{ roles: Role[] }>("/role/");
                setRoles(Array.isArray(data.roles) ? data.roles : []);
            } catch (err) {
                console.error("Roller alınamadı:", err);
            }
        };
        fetchRoles();
    }, []);

    // Rol alanı güncelle
    const handleRoleChange = async (
        id: number,
        field: keyof Role,
        value: string | boolean
    ) => {
        setRoles((prev) =>
            prev.map((role) =>
                role.id === id ? { ...role, [field]: value } : role
            )
        );

        try {
            const role = roles.find((r) => r.id === id);
            if (!role) return;

            const updated = { ...role, [field]: value };
            delete (updated as any).id;

            await put(`/role/${id}`, updated, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (err) {
            console.error("Rol güncellenemedi:", err);
        }
    };

    // Rol sil
    const handleDelete = async (id: number) => {
        try {
            await del(`/role/${id}`, { Authorization: `Bearer ${token}` });
            setRoles((prev) => prev.filter((role) => role.id !== id));
        } catch (err) {
            console.error("Rol silinemedi:", err);
        }
    };

    // Yeni rol ekle
    const handleAddRole = async () => {
        if (!newRole.name) return alert("Rol ismi boş olamaz!");

        try {
            const created = await post<Role>("/role/", newRole, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setRoles((prev) => [...prev, created]);

            // Formu sıfırla
            setNewRole({
                name: "",
                canManagePages: false,
                canCreateNews: false,
                canEditNews: false,
                canDeleteNews: false,
                canCreateBook: false,
                canEditBook: false,
                canDeleteBook: false,
                canApprovePost: false,
                canManageAnnouncements: false,
                canManageUsers: false,
                canManageRoles: false,
                canManageGallery: false,
                canManageSlider: false,
            });
        } catch (err) {
            console.error("Rol eklenemedi:", err);
        }
    };

    const permissionFields: (keyof Role)[] = [
        "canManagePages",
        "canCreateNews",
        "canEditNews",
        "canDeleteNews",
        "canCreateBook",
        "canEditBook",
        "canDeleteBook",
        "canApprovePost",
        "canManageAnnouncements",
        "canManageUsers",
        "canManageRoles",
        "canManageGallery",
        "canManageSlider",
    ];

    return (
        <div className="flex flex-col gap-6">
            {/* Mevcut Roller */}
            <div className="flex flex-col gap-1.5">
                <h1 className="text-xl font-semibold">Mevcut Roller</h1>

                {/* Tablo Başlığı */}
                <div className="grid grid-cols-15 w-full divide-x border border-stone-400 divide-stone-400 items-center text-center font-semibold rounded">
                    <span className="h-full flex items-center justify-center">Rol İsmi</span>
                    <span className="h-full flex items-center justify-center">Sayfa Yönetimi</span>
                    <span className="h-full flex items-center justify-center">Haber Oluşturma</span>
                    <span className="h-full flex items-center justify-center">Haber Düzenleme</span>
                    <span className="h-full flex items-center justify-center">Haber Silme</span>
                    <span className="h-full flex items-center justify-center">Kitap Oluşturma</span>
                    <span className="h-full flex items-center justify-center">Kitap Düzenleme</span>
                    <span className="h-full flex items-center justify-center">Kitap Silme</span>
                    <span className="h-full flex items-center justify-center">Paylaşım Onaylama</span>
                    <span className="h-full flex items-center justify-center">Duyuru Yönetimi</span>
                    <span className="h-full flex items-center justify-center">Kullanıcı Yönetimi</span>
                    <span className="h-full flex items-center justify-center">Rol Yönetimi</span>
                    <span className="h-full flex items-center justify-center">Galeri Yönetimi</span>
                    <span className="h-full flex items-center justify-center">Slider Yönetimi</span>
                    <span className="h-full flex items-center justify-center">İşlemler</span>
                </div>

                {/* Roller Listesi */}
                {roles.map((role) => (
                    <div
                        key={role.id}
                        className="grid h-12 grid-cols-15 items-center justify-center text-center"
                    >
                        <input
                            type="text"
                            value={role.name}
                            onChange={(e) =>
                                handleRoleChange(role.id, "name", e.target.value)
                            }
                            className="px-2 py-1 border-none text-center bg-transparent"
                        />

                        {permissionFields.map((field) => (
                            <Checkbox
                                key={field}
                                checked={Boolean(role[field])} // ✅ Her rol için doğru değer
                                onChange={(checked) => handleRoleChange(role.id, field, checked)}
                            />
                        ))}



                        <button
                            onClick={() => handleDelete(role.id)}
                            className="text-xs w-fit"
                        >
                            Sil
                        </button>
                    </div>
                ))}
            </div>

            {/* Yeni Rol Ekleme */}
            <div className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold">Yeni Rol Ekle</h2>
                <div className="grid grid-cols-15 gap-2 items-center">
                    <input
                        type="text"
                        placeholder="Rol İsmi"
                        value={newRole.name}
                        onChange={(e) =>
                            setNewRole((prev) => ({ ...prev, name: e.target.value }))
                        }
                        className="px-2 py-1 border rounded-md"
                    />

                    {permissionFields.map((field) => (
                        <Checkbox
                            key={field}
                            checked={!!newRole[field]}
                            onChange={(checked) =>
                                setNewRole((prev) => ({ ...prev, [field]: checked }))
                            }
                        />
                    ))}

                    <button
                        onClick={handleAddRole}
                        className="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                        Ekle
                    </button>
                </div>
            </div>
        </div>
    );
}
