/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: '#007AFF',
                'apple-gold': '#FFCC00',
                'apple-gray': '#8E8E93',
                'background-light': '#F5F5F7',
                'background-dark': '#1C1C1E',
            },
            borderRadius: {
                'ios': '12px'
            }
        }
    },
    plugins: [],
}
