import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  IconButton,
  Typography,
  Paper,
  Stack,
  Button,
} from '@mui/material';
import {
  Delete,
  DragIndicator as DragHandle,
  Add as AddIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import type { FormField } from '../features/formBuilder/formBuilderSlice';
import type { DraggableProvidedDragHandleProps } from 'react-beautiful-dnd';
import ValidationRulesSection from './ValidationRulesSection';

interface FieldEditorProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
  onDelete: () => void;
  dragHandleProps?: DraggableProvidedDragHandleProps;
}

const FieldEditor = ({ field, onUpdate, onDelete, dragHandleProps }: FieldEditorProps) => {

  const handleAddOption = () => {
    const options = field.options || [];
    onUpdate({
      options: [
        ...options,
        { label: `Option ${options.length + 1}`, value: `option${options.length + 1}` },
      ],
    });
  };

  const handleRemoveOption = (index: number) => {
    const options = [...(field.options || [])];
    options.splice(index, 1);
    onUpdate({ options });
  };

  const handleUpdateOption = (index: number, label: string) => {
    const options = [...(field.options || [])];
    options[index] = { ...options[index], label, value: label.toLowerCase().replace(/\\s+/g, '_') };
    onUpdate({ options });
  };

  return (
    <Paper 
      sx={{ 
        p: 3, 
        mb: 2,
        borderRadius: 2,
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        mb: 3,
        pb: 2,
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
      }}>
        <IconButton 
          {...dragHandleProps} 
          size="small" 
          sx={{ 
            cursor: 'grab',
            color: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.50'
            }
          }}
        >
          <DragHandle />
        </IconButton>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            flexGrow: 1,
            fontWeight: 500,
            color: 'primary.main'
          }}
        >
          {field.type.charAt(0).toUpperCase() + field.type.slice(1)} Field
        </Typography>
        <IconButton 
          onClick={onDelete} 
          size="small"
          sx={{ 
            color: 'error.main',
            '&:hover': {
              backgroundColor: 'error.50'
            }
          }}
        >
          <Delete />
        </IconButton>
      </Box>

      <Stack spacing={3}>
        <TextField
          label="Field Name"
          value={field.name}
          onChange={(e) => onUpdate({ name: e.target.value })}
          fullWidth
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />

        <TextField
          label="Label"
          value={field.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          fullWidth
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
        
        {field.type !== 'checkbox' && (
          <TextField
            label="Placeholder"
            value={field.placeholder || ''}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
            fullWidth
            variant="outlined"
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
        )}

        {(field.type === 'select' || field.type === 'radio') && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography 
              variant="subtitle2" 
              gutterBottom
              sx={{ 
                color: 'primary.main',
                fontWeight: 500,
                mb: 2
              }}
            >
              Options
            </Typography>
            {field.options?.map((option, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: 'flex', 
                  gap: 1, 
                  mb: 1.5,
                  '&:hover': {
                    '& .MuiIconButton-root': {
                      opacity: 1
                    }
                  }
                }}
              >
                <TextField
                  size="small"
                  value={option.label}
                  onChange={(e) => handleUpdateOption(index, e.target.value)}
                  fullWidth
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
                <IconButton 
                  size="small" 
                  onClick={() => handleRemoveOption(index)}
                  sx={{ 
                    color: 'error.main',
                    opacity: 0.5,
                    transition: 'opacity 0.2s',
                    '&:hover': {
                      backgroundColor: 'error.50'
                    }
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Box>
            ))}
            <Button
              startIcon={<AddIcon />}
              onClick={handleAddOption}
              variant="outlined"
              size="small"
              sx={{ 
                mt: 1,
                borderStyle: 'dashed',
                '&:hover': {
                  borderStyle: 'dashed',
                  backgroundColor: 'primary.50'
                }
              }}
            >
              Add Option
            </Button>
          </Box>
        )}

        {field.type === 'number' && (
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 2,
              p: 2, 
              bgcolor: 'background.paper', 
              borderRadius: 1 
            }}
          >
            <TextField
              type="number"
              label="Min Value"
              value={field.minValue || ''}
              onChange={(e) => onUpdate({ minValue: Number(e.target.value) })}
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
            <TextField
              type="number"
              label="Max Value"
              value={field.maxValue || ''}
              onChange={(e) => onUpdate({ maxValue: Number(e.target.value) })}
              fullWidth
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            />
          </Box>
        )}

        <Box 
          sx={{ 
            p: 2, 
            bgcolor: 'background.paper', 
            borderRadius: 1,
            display: 'flex',
            gap: 3
          }}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={field.required}
                onChange={(e) => onUpdate({ required: e.target.checked })}
                sx={{
                  color: 'primary.main',
                  '&.Mui-checked': {
                    color: 'primary.main',
                  },
                }}
              />
            }
            label={
              <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Required
              </Typography>
            }
          />

          {field.type === 'select' && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={field.multiple}
                  onChange={(e) => onUpdate({ multiple: e.target.checked })}
                  sx={{
                    color: 'primary.main',
                    '&.Mui-checked': {
                      color: 'primary.main',
                    },
                  }}
                />
              }
              label={
                <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Allow Multiple
                </Typography>
              }
            />
          )}
        </Box>

        <ValidationRulesSection field={field} onUpdate={onUpdate} />
      </Stack>
    </Paper>
  );
};

export default FieldEditor;
