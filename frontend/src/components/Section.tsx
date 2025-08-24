import { type ReactNode } from "react";

export default ({ children }: { children?: ReactNode }) => {
    return <section className="px-4 py-2">{children}</section>;
};
