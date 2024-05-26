/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#22d3ee',
        secondary: '#0e7490',
        accent: '#00cdb7',
        neutral: '#2a323c',
        'base-100': '#1d232a',
        info: '#00b5ff',
        success: '#9affdc',
        warning: '#ffbe00',
        error: '#ff5861',
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        darktheme: {
          "primary": "#22d3ee",
          "secondary": "#0e7490",
          "accent": "#00cdb7",
          "neutral": "#2a323c",
          "base-100": "#1d232a",
          //"base-100":"111827",
          // "base-100":"1f2937",
          "info": "#00b5ff",
          "success": "#9affdc",
          "warning": "#ffbe00",
          "error": "#ff5861",
          "yolo" : "#22d3ee",
        },
      },
      {
        lighttheme: {
          "primary": "#22d3ee",
          "secondary": "#0e7490",
          "accent": "#00cdb7",
          "neutral": "#e5e7eb",
          "base-100": "#ffffff",
          //"base-200": "#2f3848",
          //"base-100": "#f3f4f6",
          "info": "#3b82f6",
          "success": "#10b981",
          "warning": "#facc15",
          "error": "#ef4444",
          "yolo" : "#22d3ee",
        },
      },
    ],
  },
  // Lägger till safelist med mönster
  safelist: [
    {
      pattern: /badge-./, 
    },
    {
      pattern: /btn-./,
    }
  ],
};
