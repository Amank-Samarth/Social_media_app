// color design tokens export
export const colorTokens = {
  // Professional Color Palette
  grey: {
    0: "#f8fafc",           // Gray 50 (Light BG)
    50: "#f1f5f9",          // Gray 100
    100: "#e2e8f0",         // Gray 200
    200: "#cbd5e1",         // Gray 300
    300: "#94a3b8",         // Gray 400
    400: "#64748b",         // Gray 500
    500: "#475569",         // Gray 600
    600: "#334155",         // Gray 700
    700: "#1e293b",         // Gray 800 (Dark BG)
    800: "#18181b",         // Gray 900 (Darkest BG)
    900: "#0f172a",         // Gray 950
    1000: "#020617"         // Black
  },
  primary: {
    50: "#eff6ff",           // Blue 50
    100: "#dbeafe",          // Blue 100
    200: "#bfdbfe",          // Blue 200
    300: "#60a5fa",          // Blue 400 (Light)
    400: "#2563eb",          // Blue 600 (Main)
    500: "#1d4ed8",          // Blue 700 (Dark)
    600: "#1e40af",          // Blue 800
    700: "#172554",          // Blue 900
    800: "#0c1136",          // Custom Deep Blue
    900: "#020617"           // Black
  },
  secondary: {
    50: "#f8fafc",           // Slate 50
    100: "#e2e8f0",          // Slate 200
    200: "#cbd5e1",          // Slate 300 (Light)
    300: "#64748b",          // Slate 500 (Main)
    400: "#334155",          // Slate 700 (Dark)
    500: "#1e293b",          // Slate 800
    600: "#0f172a",          // Slate 950
    700: "#020617",          // Black
    800: "#020617",
    900: "#020617"
  },
  accent: {
    green: "#22c55e",        // Success
    red: "#ef4444",          // Error
    orange: "#f59e42",       // Warning
    purple: "#a78bfa"        // Info/Highlight
  },
};

// mui theme settings
export const themeSettings = (mode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colorTokens.primary[400],
              dark: colorTokens.primary[500],
              light: colorTokens.primary[300],
            },
            secondary: {
              main: colorTokens.secondary[300],
              dark: colorTokens.secondary[400],
              light: colorTokens.secondary[200],
              contrastText: colorTokens.grey[0],
            },
            accent: {
              green: colorTokens.accent.green,
              red: colorTokens.accent.red,
              orange: colorTokens.accent.orange,
              purple: colorTokens.accent.purple,
            },
            background: {
              default: colorTokens.grey[800],
              paper: colorTokens.grey[700],
              alt: colorTokens.grey[700],
            },
            text: {
              primary: colorTokens.grey[0],
              secondary: colorTokens.grey[200],
            },
          }
        : {
            primary: {
              main: colorTokens.primary[400],
              dark: colorTokens.primary[500],
              light: colorTokens.primary[300],
            },
            secondary: {
              main: colorTokens.secondary[300],
              dark: colorTokens.secondary[400],
              light: colorTokens.secondary[200],
              contrastText: colorTokens.grey[800],
            },
            accent: {
              green: colorTokens.accent.green,
              red: colorTokens.accent.red,
              orange: colorTokens.accent.orange,
              purple: colorTokens.accent.purple,
            },
            background: {
              default: colorTokens.grey[0],
              paper: colorTokens.grey[50],
              alt: colorTokens.grey[100],
            },
            text: {
              primary: colorTokens.grey[800],
              secondary: colorTokens.grey[400],
            },
          }),
    },
    typography: {
      fontFamily: ["Montserrat", "Roboto", "sans-serif"].join(","),
      fontSize: 14,
      h1: {
        fontFamily: ["Montserrat", "Roboto", "sans-serif"].join(","),
        fontSize: 32,
        fontWeight: 700,
      },
      h2: {
        fontFamily: ["Montserrat", "Roboto", "sans-serif"].join(","),
        fontSize: 24,
        fontWeight: 700,
      },
      h3: {
        fontFamily: ["Montserrat", "Roboto", "sans-serif"].join(","),
        fontSize: 20,
        fontWeight: 700,
      },
      h4: {
        fontFamily: ["Montserrat", "Roboto", "sans-serif"].join(","),
        fontSize: 18,
        fontWeight: 600,
      },
      h5: {
        fontFamily: ["Montserrat", "Roboto", "sans-serif"].join(","),
        fontSize: 16,
        fontWeight: 600,
      },
      h6: {
        fontFamily: ["Montserrat", "Roboto", "sans-serif"].join(","),
        fontSize: 15,
        fontWeight: 600,
      },
      body1: {
        fontFamily: ["Roboto", "Montserrat", "sans-serif"].join(","),
        fontSize: 14,
        fontWeight: 400,
      },
      body2: {
        fontFamily: ["Roboto", "Montserrat", "sans-serif"].join(","),
        fontSize: 13,
        fontWeight: 400,
      },
    },
  };
};
