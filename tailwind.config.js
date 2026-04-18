/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        status: {
          todo: {
            DEFAULT: 'hsl(var(--status-todo))',
            foreground: 'hsl(var(--status-todo-foreground))',
            soft: 'hsl(var(--status-todo-soft))',
          },
          progress: {
            DEFAULT: 'hsl(var(--status-progress))',
            foreground: 'hsl(var(--status-progress-foreground))',
            soft: 'hsl(var(--status-progress-soft))',
          },
          done: {
            DEFAULT: 'hsl(var(--status-done))',
            foreground: 'hsl(var(--status-done-foreground))',
            soft: 'hsl(var(--status-done-soft))',
          },
          blocked: {
            DEFAULT: 'hsl(var(--status-blocked))',
            foreground: 'hsl(var(--status-blocked-foreground))',
            soft: 'hsl(var(--status-blocked-soft))',
          },
        },
        priority: {
          low: {
            DEFAULT: 'hsl(var(--priority-low))',
            foreground: 'hsl(var(--priority-low-foreground))',
            soft: 'hsl(var(--priority-low-soft))',
          },
          medium: {
            DEFAULT: 'hsl(var(--priority-medium))',
            foreground: 'hsl(var(--priority-medium-foreground))',
            soft: 'hsl(var(--priority-medium-soft))',
          },
          high: {
            DEFAULT: 'hsl(var(--priority-high))',
            foreground: 'hsl(var(--priority-high-foreground))',
            soft: 'hsl(var(--priority-high-soft))',
          },
          urgent: {
            DEFAULT: 'hsl(var(--priority-urgent))',
            foreground: 'hsl(var(--priority-urgent-foreground))',
            soft: 'hsl(var(--priority-urgent-soft))',
          },
        },
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, hsl(var(--primary)), hsl(217 91% 60%))',
        'brand-radial':
          'radial-gradient(circle at 20% 20%, hsl(var(--primary) / 0.25), transparent 60%), radial-gradient(circle at 80% 80%, hsl(217 91% 60% / 0.2), transparent 60%)',
      },
      boxShadow: {
        soft: '0 1px 2px rgb(0 0 0 / 0.04), 0 1px 3px rgb(0 0 0 / 0.06)',
        elevated: '0 8px 24px -8px rgb(0 0 0 / 0.12), 0 2px 4px rgb(0 0 0 / 0.04)',
        glow: '0 0 0 4px hsl(var(--ring) / 0.15)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
