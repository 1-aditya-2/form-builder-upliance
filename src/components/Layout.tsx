import { ReactNode } from 'react';
import { Box, Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { Add as AddIcon, Preview as PreviewIcon, List as ListIcon } from '@mui/icons-material';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Create Form', path: '/create', icon: AddIcon },
    { label: 'Preview', path: '/preview', icon: PreviewIcon },
    { label: 'My Forms', path: '/myforms', icon: ListIcon },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          backdropFilter: 'blur(8px)',
          backgroundColor: 'rgba(35, 35, 56, 0.8)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography 
              variant="h5" 
              component="div"
              sx={{ 
                background: 'linear-gradient(45deg, #9c27b0, #ba68c8)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
              }}
            >
              Form Builder
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.path}
                    color={location.pathname === item.path ? 'primary' : 'inherit'}
                    onClick={() => navigate(item.path)}
                    startIcon={<Icon />}
                    sx={{
                      borderRadius: '8px',
                      py: 1,
                      px: 2,
                      backgroundColor: location.pathname === item.path ? 'rgba(156, 39, 176, 0.1)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(156, 39, 176, 0.1)',
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box sx={{ pt: 8 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
