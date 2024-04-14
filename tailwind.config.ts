import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';
import daisyui from 'daisyui';

export default {
    content: ['./src/**/*.tsx'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', ...fontFamily.sans],
            },
        },
    },
    plugins: [daisyui],
    daisyui: {
        themes: ['night'],
    },
} satisfies Config;
