/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand
        primary: {
          DEFAULT: '#FFA500',
          600: '#ff8c00',
          700: '#ff9500',
        },
        secondary: {
          DEFAULT: '#2563eb',
        },

        // Neutrals & surfaces
        bg: {
          DEFAULT: '#ffffff',
          paper: '#faf8f5',
          surface: '#f5f5f5',
        },
        border: {
          DEFAULT: '#e0e0e0',
          light: '#ede9e3',
        },
        muted: {
          DEFAULT: '#666666',
          hint: '#9e9890',
        },
        text: {
          DEFAULT: '#1a1714',
          strong: '#1a1a1a',
        },

        // Status
        danger: '#e53e3e',
        success: '#38a169',
        warn: {
          DEFAULT: '#dd6b20',
          alt: '#d69e2e',
        },
      },
      fontFamily: {
        sans: ["Outfit", "Plus Jakarta Sans", "Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif"],
      },
      fontSize: {
        // Titles
        'title-1': ['2.375rem', { lineHeight: '1.18' }], // 38px
        'title-2': ['1.875rem', { lineHeight: '1.15' }], // 30px
        'title-3': ['1.25rem', { lineHeight: '1.2' }], // 20px

        // Subtitles
        'subtitle-lg': ['1rem', { lineHeight: '1.6' }], // 16px
        'subtitle-sm': ['0.875rem', { lineHeight: '1.5' }], // 14px

        // Body
        'body-lg': ['1rem', { lineHeight: '1.7' }], // 16px
        'body-md': ['0.9375rem', { lineHeight: '1.6' }], // 15px
        'body-sm': ['0.875rem', { lineHeight: '1.6' }], // 14px
        'body-xs': ['0.75rem', { lineHeight: '1.4' }], // 12px
      },
      fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      },
      boxShadow: {
        'brand-md': '0 8px 24px rgba(255,165,0,0.08)',
      },
    },
  },
  plugins: [],
}
