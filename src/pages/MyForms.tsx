import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import { Preview } from '@mui/icons-material';
import { loadForms, setCurrentForm } from '../features/formBuilder/formBuilderSlice';
import { RootState } from '../store';

const MyForms = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const forms = useSelector((state: RootState) => state.formBuilder.forms);

  useEffect(() => {
    dispatch(loadForms());
  }, [dispatch]);

  const handlePreview = (formId: string) => {
    const form = forms.find(f => f.id === formId);
    if (form) {
      dispatch(setCurrentForm(form));
      navigate('/preview');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 6 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            gutterBottom
            sx={{
              background: 'linear-gradient(45deg, #9c27b0, #ba68c8)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold',
            }}
          >
            My Forms
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage and preview your created forms
          </Typography>
        </Box>

        {forms.length === 0 ? (
          <Paper
            sx={{
              p: 6,
              textAlign: 'center',
              backgroundColor: 'rgba(35, 35, 56, 0.7)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No forms created yet
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={() => navigate('/create')}
              sx={{ mt: 2 }}
            >
              Create Your First Form
            </Button>
          </Paper>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
            {forms.map((form) => (
              <Paper
                key={form.id}
                sx={{
                  p: 3,
                  transition: 'all 0.2s ease-in-out',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.2)',
                    backgroundColor: 'rgba(156, 39, 176, 0.1)',
                  },
                }}
                onClick={() => handlePreview(form.id)}
              >
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {form.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Created: {formatDate(form.createdAt)}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {form.fields.length} {form.fields.length === 1 ? 'field' : 'fields'}
                  </Typography>
                  <IconButton
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(form.id);
                    }}
                  >
                    <Preview />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default MyForms;
