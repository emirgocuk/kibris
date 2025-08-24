// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
    content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
    theme: {
        extend: {
            fontFamily: {
                // Varsayılan sans fontunu Helvetica Neue olarak ayarlıyoruz
                sans: ['"Helvetica Neue 55"', 'Helvetica', 'Arial', 'sans-serif'],
            },
        },
    },
    plugins: [],
};

export default config;