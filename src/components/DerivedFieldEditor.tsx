import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { FormField, DerivedFieldConfig } from '../features/formBuilder/formBuilderSlice';

interface DerivedFieldEditorProps {
  open: boolean;
  onClose: () => void;
  onSave: (config: DerivedFieldConfig) => void;
  availableFields: FormField[];
  currentConfig?: DerivedFieldConfig;
}

const DerivedFieldEditor = ({
  open,
  onClose,
  onSave,
  availableFields,
  currentConfig,
}: DerivedFieldEditorProps) => {
  const [parentFields, setParentFields] = useState<string[]>(currentConfig?.parentFields || []);
  const [formula, setFormula] = useState(currentConfig?.formula || '');
  const [description, setDescription] = useState(currentConfig?.description || '');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!parentFields.length) {
      setError('Please select at least one parent field');
      return;
    }

    if (!formula) {
      setError('Please enter a formula');
      return;
    }

    try {
      // Test the formula with sample values
      const sampleValues = parentFields.map(() => 1);
      // Replace $0, $1, etc. with sample values
      const testFormula = formula.replace(/\$(\d+)/g, (_, i) => String(sampleValues[Number(i)]));
      eval(testFormula); // Test if formula is valid JavaScript

      onSave({
        parentFields,
        formula,
        description,
      });
      onClose();
    } catch (err) {
      setError('Invalid formula. Please check your formula and try again.');
    }
  };

  const formatFieldName = (field: FormField) => {
    return `${field.label} (${field.type})`;
  };

  const getFormulaHint = () => {
    const hints = parentFields.map((fieldId, index) => {
      const field = availableFields.find(f => f.id === fieldId);
      return `$${index} = ${field?.label || fieldId}`;
    });
    return hints.join('\n');
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" className="gradient-text">
          Configure Derived Field
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          {error && (
            <Alert severity="error" onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <FormControl fullWidth>
            <InputLabel>Parent Fields</InputLabel>
            <Select
              multiple
              value={parentFields}
              onChange={(e) => setParentFields(e.target.value as string[])}
              label="Parent Fields"
            >
              {availableFields
                .filter((field) => field.type === 'number' || field.type === 'date')
                .map((field) => (
                  <MenuItem key={field.id} value={field.id}>
                    {formatFieldName(field)}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={2}
            placeholder="Describe how this derived field is calculated"
          />

          <Box>
            <TextField
              fullWidth
              label="Formula"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              multiline
              rows={3}
              placeholder="Enter your formula using $0, $1, etc. for parent field values"
              helperText="Example: For age calculation: new Date().getFullYear() - new Date($0).getFullYear()"
            />
            {parentFields.length > 0 && (
              <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                Available fields:
                {getFormulaHint().split('\n').map((hint, i) => (
                  <Typography key={i} variant="caption" sx={{ display: 'block', ml: 1 }}>
                    {hint}
                  </Typography>
                ))}
              </Typography>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined" color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DerivedFieldEditor;
