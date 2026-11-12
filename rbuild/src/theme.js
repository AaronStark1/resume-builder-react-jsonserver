import { createTheme, responsiveFontSizes } from '@mui/material/styles'

let theme = createTheme({
  palette: {
    primary: {
      main: '#3d0066',
      dark: '#14002b',
    },
    secondary: {
      main: '#ff7b00',
      dark: '#e56a00',
    },
    background: {
      default: '#f7f7fb',
    },
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
          boxShadow: '0 1px 3px rgba(20,0,43,0.06), 0 4px 12px rgba(20,0,43,0.04)',
          border: '1px solid rgba(20,0,43,0.08)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(20,0,43,0.06), 0 4px 12px rgba(20,0,43,0.04)',
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
        },
        '*:focus-visible': {
          outline: '2px solid #3d0066',
          outlineOffset: '2px',
        },
      },
    },
  },
  custom: {
    gradient: 'linear-gradient(120deg, #14002b, #3d0066)',
  },
})

theme = responsiveFontSizes(theme)

export default theme

