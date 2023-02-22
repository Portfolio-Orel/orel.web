/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'jit',
    important: false,
    darkMode: 'class',
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        fontFamily: {
            Poppins: ['Poppins']
        },
        colors: {
            text: '#f2f2f2',
            'text-secondary': '#a6a6a6',
            primary: '#9333ea',
            secondary: '#D926A9',
            accent: '#1FB2A6',
            neutral: '#6b7280',
            background: '#000000',
            info: '#3ABFF8',
            success: '#36D399',
            warning: '#FBBD23',
            error: '#F87272',
            shadow: 'rgba(255, 255, 255, 0.2)',
        },
        extend: {
            gridTemplateRows: {
                'layout': '65px 1fr 20px'
            },
            padding: {
                '4.5': '1.125rem',
            },
            height: {
                88: '22rem'
            },
            animation: {
                pulse: 'pulse 1.7s linear infinite',
                disappear: 'disappear 0.4s ease-in-out forwards',
                appear: 'appear 0.3s ease-in-out forwards',
                floating: 'floating 3.3s ease-in-out infinite',
                'expand-appear': 'expand-appear 0.3s ease-in-out forwards',
                'collapse-disappear': 'collapse-disappear 0.3s ease-in-out forwards',
            },
            keyframes: {
                appear: {
                    '0%': {
                        opacity: 0
                    },
                    '25%': {
                        opacity: 0.25
                    },
                    '50%': {
                        opacity: 0.5
                    },
                    '75%': {
                        opacity: 0.75
                    },
                    '100%': {
                        opacity: 1
                    },
                },
                disappear: {
                    '0%': {
                        opacity: 1
                    },
                    '25%': {
                        opacity: 0.75
                    },
                    '50%': {
                        opacity: 0.5
                    },
                    '75%': {
                        opacity: 0.25,
                    },
                    '100%': {
                        opacity: 0,
                        'z-index': -1
                    },
                },
                pulse: {
                    '0%': {
                        transform: 'scale(0.3)',
                        opacity: '0',
                    },
                    '50%': {
                        transform: 'scale(1)',
                        opacity: '0.8'
                    },
                    '75%': {
                        transform: 'scale(0.95)',
                        opacity: '0.2',
                    },

                    '100%': {
                        transform: 'scale(0.9)',
                        opacity: '0'
                    },


                },
                floating: {
                    '0%': {
                        'box-shadow': '0 5px 15px 0px shadow',
                        transform: 'translatey(0px)',
                    },
                    '50%': {
                        'box-shadow': '0 25px 15px 0px shadow',
                        transform: 'translatey(-10px)',
                    },
                    '100%': {
                        'box-shadow': '0 5px 15px 0px shadow',
                        transform: 'translatey(0px)',
                    },
                },
                'expand-appear': {
                    '0%': {
                        width: '0%',
                        height: '0%',
                        opacity: '0',
                    },
                    '50%': {
                        width: '50%',
                        height: '50%',
                        opacity: '0.5',
                    },
                    '100%': {
                        width: '100%',
                        height: '100%',
                        opacity: '1',
                    },
                },
                'collapse-disappear': {
                    '0%': {
                        width: '100%',
                        height: '100%',
                        opacity: '1',
                    },
                    '50%': {
                        width: '50%',
                        height: '50%',
                        opacity: '0.5',
                    },
                    '100%': {
                        width: '100%',
                        height: '100%',
                        opacity: '0',
                    },
                },
            },
        },
    },

    plugins: [
        require('tailwind-scrollbar'),
    ],
};