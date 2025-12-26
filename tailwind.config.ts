import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        foreground: 'var(--foreground)',
        muted: 'var(--muted)',
        border: 'var(--border-color)',
        primary: {
          DEFAULT: 'var(--primary)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)'
        },
        accent: 'var(--accent)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        'ai-accent': 'var(--ai-accent)'
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        pill: '9999px'
      },
      spacing: {
        '2.5': '0.625rem',
        '4.5': '1.125rem'
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)',
        soft: 'var(--shadow-soft)',
        elevated: 'var(--shadow-elevated)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.02)'
      },
      transitionDuration: {
        75: 'var(--motion-instant)',
        150: 'var(--motion-fast)',
        200: 'var(--motion-normal)',
        300: 'var(--motion-slow)'
      },
      fontSize: {
        '2xl-hero': ['2.25rem', { lineHeight: '1.05' }],
        'xl-title': ['1.5rem', { lineHeight: '1.12' }]
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-in-down': 'slideInDown 0.5s ease-out'
      }
    },
  },
  plugins: [],
}
export default config

