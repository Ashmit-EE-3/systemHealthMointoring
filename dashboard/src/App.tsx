import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ExportButton from './components/ExportButton.tsx';
import SystemList from './components/SystemList.tsx';
import theme from './theme.ts';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Box my={4} display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h4" component="h1" gutterBottom>
            System Dashboard
          </Typography>
          <ExportButton />
        </Box>
        <SystemList />
      </Container>
    </ThemeProvider>
  );
};

export default App;
