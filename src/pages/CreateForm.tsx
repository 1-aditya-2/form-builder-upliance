import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  TextField,
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
} from '@mui/material';
import {
  TextFields,
  Numbers,
  CheckBox,
  RadioButtonChecked,
  List,
  TextSnippet,
  CalendarToday,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult, DroppableProvided, DraggableProvided } from 'react-beautiful-dnd';
import FieldEditor from '../components/FieldEditor';
import { v4 as uuidv4 } from 'uuid';
import { setCurrentForm, addForm } from '../features/formBuilder/formBuilderSlice';
import type { Form, FormField, FieldType } from '../features/formBuilder/formBuilderSlice';
import type { RootState } from '../store';

const fieldTypes = [
  { type: 'text' as const, icon: TextFields, label: 'Text' },
  { type: 'number' as const, icon: Numbers, label: 'Number' },
  { type: 'textarea' as const, icon: TextSnippet, label: 'Text Area' },
  { type: 'select' as const, icon: List, label: 'Dropdown' },
  { type: 'radio' as const, icon: RadioButtonChecked, label: 'Multiple Choice' },
  { type: 'checkbox' as const, icon: CheckBox, label: 'Checkbox' },
  { type: 'date' as const, icon: CalendarToday, label: 'Date' },
];

const CreateForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentForm = useSelector((state: RootState) => state.formBuilder.currentForm);
  const [formName, setFormName] = useState('');

  const addField = (type: FieldType) => {
    const newField: FormField = {
      id: uuidv4(),
      type,
      name: `field_${currentForm?.fields.length || 0}`,
      label: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Field`,
      required: false,
      validations: [],
      options: type === 'select' || type === 'radio' ? [
        { label: 'Option 1', value: 'option1' },
        { label: 'Option 2', value: 'option2' },
      ] : undefined,
      order: currentForm?.fields.length || 0,
    };

    const updatedForm: Form = {
      ...currentForm || { id: uuidv4(), name: '', fields: [], createdAt: new Date().toISOString() },
      fields: [...(currentForm?.fields || []), newField],
    };

    dispatch(setCurrentForm(updatedForm));
  };

  const handleSave = () => {
    if (!currentForm || !formName) return;

    const formToSave: Form = {
      ...currentForm,
      name: formName,
      createdAt: new Date().toISOString(),
    };

    dispatch(addForm(formToSave));
    dispatch(setCurrentForm(null));
    setFormName('');
    navigate('/myforms');
  };

  const handleFieldUpdate = (fieldId: string, updates: Partial<FormField>) => {
    if (!currentForm) return;

    const updatedFields = currentForm.fields.map(field =>
      field.id === fieldId ? { ...field, ...updates } : field
    );

    dispatch(setCurrentForm({ ...currentForm, fields: updatedFields }));
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !currentForm) return;

    const fields = Array.from(currentForm.fields);
    const [reorderedItem] = fields.splice(result.source.index, 1);
    fields.splice(result.destination.index, 0, reorderedItem);

    const updatedFields = fields.map((field, index) => ({
      ...field as FormField,
      order: index,
    }));

    dispatch(setCurrentForm({ ...currentForm, fields: updatedFields }));
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{ 
            color: 'primary.main',
            fontWeight: 600,
            mb: 4
          }}
        >
          Create Form
        </Typography>

        <Paper 
          sx={{ 
            p: 4, 
            mb: 3,
            borderRadius: 2,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
          }}
        >
          <Box>
            <TextField
              fullWidth
              label="Form Name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Box sx={{
            mb: 4,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover fieldset': {
                borderColor: 'primary.main',
              }
            }
          }}>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="fields">
                {(provided: DroppableProvided) => (
                  <Box
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {currentForm?.fields.map((field: FormField, index: number) => (
                      <Draggable
                        key={field.id}
                        draggableId={field.id}
                        index={index}
                      >
                        {(dragProvided: DraggableProvided) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                          >
                            <FieldEditor
                              field={field}
                              onUpdate={(updates) => handleFieldUpdate(field.id, updates)}
                              onDelete={() => {
                                if (!currentForm) return;
                                const updatedFields = currentForm.fields.filter((f: FormField) => f.id !== field.id);
                                dispatch(setCurrentForm({ ...currentForm, fields: updatedFields }));
                              }}
                              dragHandleProps={dragProvided.dragHandleProps ?? undefined}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </DragDropContext>
          </Box>

          <Box 
            sx={{ 
              mt: 4, 
              mb: 4, 
              p: 3, 
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom
              sx={{
                color: 'primary.main',
                fontWeight: 500,
                mb: 2
              }}
            >
              Add Fields
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 1.5, 
                flexWrap: 'wrap',
                '& .MuiButton-root': {
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                  }
                }
              }}
            >
              {fieldTypes.map(({ type, icon: Icon, label }) => (
                <Button
                  key={type}
                  variant="outlined"
                  startIcon={<Icon />}
                  onClick={() => addField(type)}
                  sx={{ 
                    bgcolor: 'background.paper',
                    borderColor: 'primary.100',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.50',
                      borderColor: 'primary.main'
                    }
                  }}
                >
                  {label}
                </Button>
              ))}
            </Box>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'right' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={!formName || !currentForm?.fields.length}
              size="large"
              sx={{ 
                px: 4,
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(0, 0, 0, 0.2)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.2s ease-in-out'
              }}
            >
              Save Form
            </Button>
          </Box>
        </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateForm;
