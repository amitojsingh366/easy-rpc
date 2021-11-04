const { borderWidth } = require('tailwindcss/defaultTheme');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
    purge: ['./public/**/*.html', './src/**/*.{js,jsx,ts,tsx,vue}'],
    // specify other options here
    theme: {
        extend: {
            colors: {
                discord: {
                    blurple: '#5865F2',
                    lightBlurple: '#727df1',
                    green: '#57F287',
                    green2: '#3ba55d',
                    yellow: '#FEE75C',
                    red: '#ED4245',
                    lightRed: '#ff6673',
                    grey: '#2c2f33',
                    lightBlack: '#23272a',
                    lightGrey: '#99aab5',
                    lightGrey2: '#4f545c',
                    black: '#18191c'
                }
            },
            borderWidth: {
                3: '3px',
                6: '6px'
            }
        }

    }
};