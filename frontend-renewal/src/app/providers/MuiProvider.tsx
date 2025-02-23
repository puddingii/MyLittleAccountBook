import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

interface MuiProviderProps {
  children: React.ReactNode;
}

const MuiProvider = ({ children }: MuiProviderProps) => {
  const muiTheme = useMemo(
    () =>
      createTheme({
        components: {},
      }),
    [],
  );

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};

export default MuiProvider;
