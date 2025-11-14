declare module 'tailwindcss/lib/util/flattenColorPalette' {
  export default function flattenColorPalette(colors: any): any;
}

declare global {
  namespace TailwindCSS {
    interface Colors {
      black: {
        0: string; 5: string; 10: string; 15: string; 20: string;
        25: string; 30: string; 35: string; 40: string; 45: string;
        50: string; 55: string; 60: string; 65: string; 70: string;
        75: string; 80: string; 85: string; 90: string; 95: string; 100: string;
      };
      white: {
        0: string; 5: string; 10: string; 15: string; 20: string;
        25: string; 30: string; 35: string; 40: string; 45: string;
        50: string; 55: string; 60: string; 65: string; 70: string;
        75: string; 80: string; 85: string; 90: string; 95: string; 100: string;
      };
    }
  }
}

export {};