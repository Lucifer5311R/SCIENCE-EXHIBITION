/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            keyframes: {
                dash: {
                    to: { strokeDashoffset: '-1000' }
                }
            },
            animation: {
                dash: 'dash 40s linear infinite'
            }
        },
    },
    plugins: [],
}
