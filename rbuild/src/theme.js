import { createTheme, responsiveFontSizes } from '@mui/material/styles'

export const getAppTheme = (mode = 'light') => {
  const isDark = mode === 'dark'

  let theme = createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#c084fc' : '#3d0066',
        light: isDark ? '#d8b4fe' : '#6a1b9a',
        dark: isDark ? '#7c3aed' : '#14002b',
      },
      secondary: {
        main: isDark ? '#ff9100' : '#ff7b00',
        light: isDark ? '#ffa726' : '#ffa040',
        dark: '#e56a00',
      },
      background: {
        default: isDark ? '#0c0714' : '#f7f7fb',
        paper: isDark ? '#171024' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f5f3f9' : '#14002b',
        secondary: isDark ? '#a79fb7' : '#5c546b',
      },
      divider: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(20, 0, 43, 0.08)',
    },
    typography: {
      fontFamily: '"Inter Variable", "Inter", system-ui, sans-serif',
      h1: {
        fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", system-ui, sans-serif',
        fontWeight: 800,
        letterSpacing: '-0.02em',
      },
      h2: {
        fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", system-ui, sans-serif',
        fontWeight: 800,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", system-ui, sans-serif',
        fontWeight: 700,
        letterSpacing: '-0.02em',
      },
      h4: {
        fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", system-ui, sans-serif',
        fontWeight: 700,
        letterSpacing: '-0.01em',
      },
      h5: {
        fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", system-ui, sans-serif',
        fontWeight: 700,
      },
      h6: {
        fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", system-ui, sans-serif',
        fontWeight: 600,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: isDark
              ? '0 4px 20px rgba(0,0,0,0.45)'
              : '0 1px 3px rgba(20,0,43,0.06), 0 4px 12px rgba(20,0,43,0.04)',
            border: isDark
              ? '1px solid rgba(255,255,255,0.08)'
              : '1px solid rgba(20,0,43,0.08)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow: isDark
              ? '0 4px 20px rgba(0,0,0,0.45)'
              : '0 1px 3px rgba(20,0,43,0.06), 0 4px 12px rgba(20,0,43,0.04)',
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          size: 'small',
        },
      },
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            margin: 0,
            padding: 0,
            backgroundColor: isDark ? '#0c0714' : '#f7f7fb',
            color: isDark ? '#f5f3f9' : '#14002b',
          },
          '*:focus-visible': {
            outline: isDark ? '2px solid #ff9100' : '2px solid #3d0066',
            outlineOffset: '2px',
          },
        },
      },
    },
    custom: {
      gradient: isDark
        ? 'linear-gradient(135deg, #09030f 0%, #170928 60%, #2a0e44 100%)'
        : 'linear-gradient(120deg, #14002b, #3d0066)',
    },
  })

  return responsiveFontSizes(theme)
}

const defaultTheme = getAppTheme('light')
export default defaultTheme
