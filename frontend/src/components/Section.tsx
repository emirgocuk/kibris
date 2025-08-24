import { type ReactNode } from "react";

export default ({ children }: { children?: ReactNode }) => {
    // Sadece dikey boşluk (padding) bırakıyoruz.
    return <section className="py-8">{children}</section>;
};