/** @type {import('tailwindcss').Config} */
export default {
    theme: {
        extend: {
            colors: {
                // Primary Green Palette - Xanh Lá Cây
                'primary': {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#145231',
                    950: '#052e16',
                },
                // Secondary Accent - Nâu (Brown)
                'accent': {
                    50: '#faf5f0',
                    100: '#f5ede4',
                    200: '#ede0d9',
                    300: '#d9cfc2',
                    400: '#c9baaa',
                    500: '#b39587',
                    600: '#a0826e',
                    700: '#8b6f5f',
                    800: '#78654f',
                    900: '#654530',
                    950: '#4a3728',
                },
                // Tertiary - Xanh Đậm (Dark Green)
                'tertiary': {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#16a34a',
                    600: '#15803d',
                    700: '#166534',
                    800: '#0f4d2a',
                    900: '#0a3d1f',
                    950: '#052e16',
                },
            },
            backgroundImage: {
                'gradient-green': 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                'gradient-accent': 'linear-gradient(135deg, #b39587 0%, #8b6f5f 100%)',
                'gradient-primary': 'linear-gradient(135deg, #16a34a 0%, #8b6f5f 100%)',
            },
        },
    },
    plugins: [],
};
