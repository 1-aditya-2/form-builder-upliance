import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  FormHelperText,
  Stack,
  Divider,
} from '@mui/material';
import { RootState } from '../store';
import { FormField } from '../features/formBuilder/formBuilderSlice';

const PreviewForm = () => {
  const currentForm = useSelector((state: RootState) => state.formBuilder.currentForm);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const validateField = (field: FormField, value: any) => {
    if (field.required && (value === '' || value === null || value === undefined)) {
      return 'This field is required';
    }

    if (value === '' || value === null || value === undefined) {
      return '';
    }

    for (const validation of field.validations) {
      switch (validation.type) {
        case 'minLength':
          if (typeof value === 'string' && value.length < validation.value) {
            return `Minimum length is ${validation.value} characters`;
          }
          break;
        case 'maxLength':
          if (typeof value === 'string' && value.length > validation.value) {
            return `Maximum length is ${validation.value} characters`;
          }
          break;
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Please enter a valid email address';
          }
          break;
        case 'password':
          if (!/^(?=.*[0-9])(?=.*[a-zA-Z]).{8,}$/.test(value)) {
            return 'Password must be at least 8 characters and contain both letters and numbers';
          }
          break;
      }
    }

    if (field.type === 'number') {
      const numValue = Number(value);
      if (field.minValue !== undefined && numValue < field.minValue) {
        return `Value must be at least ${field.minValue}`;
      }
      if (field.maxValue !== undefined && numValue > field.maxValue) {
        return `Value must not exceed ${field.maxValue}`;
      }
    }

    return '';
  };

  const handleChange = (fieldId: string, value: any) => {
    const field = currentForm?.fields.find(f => f.id === fieldId);
    if (!field) return;

    const newValues = { ...formValues, [fieldId]: value };
    setFormValues(newValues);

    // Validate the field
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [fieldId]: error }));

    // Update derived fields
    currentForm?.fields.forEach(f => {
      if (f.derivedField) {
        const parentValues = f.derivedField.parentFields.map(parentId => newValues[parentId]);
        try {
          // This is a simplified example - in a real app, you'd want to use a proper formula parser
          const derivedValue = eval(f.derivedField.formula.replace(/\$(\d+)/g, (_, i) => parentValues[i]));
          setFormValues(prev => ({ ...prev, [f.id]: derivedValue }));
        } catch (error) {
          console.error('Error calculating derived field:', error);
        }
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    // Validate all fields
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    currentForm?.fields.forEach(field => {
      const error = validateField(field, formValues[field.id]);
      if (error) {
        newErrors[field.id] = error;
        hasErrors = true;
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      // Show success message
      setShowSuccessMessage(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormValues({});
        setErrors({});
        setIsSubmitted(false);
        setShowSuccessMessage(false);
      }, 3000);
    }
  };

  const renderField = (field: FormField) => {
    const error = errors[field.id];
    const value = formValues[field.id] ?? field.defaultValue ?? '';

    const commonProps = {
      id: field.id,
      error: !!error,
      disabled: !!field.derivedField,
      required: field.required,
      sx: { mb: 2 },
    };

    switch (field.type) {
      case 'text':
        return (
          <TextField
            {...commonProps}
            fullWidth
            type="text"
            label={field.label}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            helperText={error || field.description}
            placeholder={field.placeholder}
          />
        );

      case 'number':
        return (
          <TextField
            {...commonProps}
            fullWidth
            type="number"
            label={field.label}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            helperText={error || field.description}
            placeholder={field.placeholder}
            inputProps={{
              min: field.minValue,
              max: field.maxValue,
            }}
          />
        );

      case 'textarea':
        return (
          <TextField
            {...commonProps}
            fullWidth
            multiline
            rows={4}
            label={field.label}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            helperText={error || field.description}
            placeholder={field.placeholder}
          />
        );

      case 'select':
        return (
          <FormControl {...commonProps} fullWidth>
            <FormLabel>{field.label}</FormLabel>
            {field.description && (
              <FormHelperText sx={{ mb: 1 }}>{field.description}</FormHelperText>
            )}
            <Select
              value={value}
              onChange={(e) => handleChange(field.id, e.target.value)}
              multiple={field.multiple}
              error={!!error}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText error>{error}</FormHelperText>}
          </FormControl>
        );

      case 'radio':
        return (
          <FormControl {...commonProps} component="fieldset">
            <FormLabel>{field.label}</FormLabel>
            {field.description && (
              <FormHelperText sx={{ mb: 1 }}>{field.description}</FormHelperText>
            )}
            <RadioGroup
              value={value}
              onChange={(e) => handleChange(field.id, e.target.value)}
            >
              {field.options?.map((option) => (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  control={<Radio disabled={!!field.derivedField} />}
                  label={option.label}
                />
              ))}
            </RadioGroup>
            {error && <FormHelperText error>{error}</FormHelperText>}
          </FormControl>
        );

      case 'checkbox':
        return (
          <FormControl {...commonProps} component="fieldset">
            <FormControlLabel
              control={
                <Checkbox
                  checked={value}
                  onChange={(e) => handleChange(field.id, e.target.checked)}
                  disabled={!!field.derivedField}
                />
              }
              label={field.label}
            />
            {field.description && (
              <FormHelperText>{field.description}</FormHelperText>
            )}
            {error && <FormHelperText error>{error}</FormHelperText>}
          </FormControl>
        );

      case 'date':
        return (
          <TextField
            {...commonProps}
            fullWidth
            type="date"
            label={field.label}
            value={value}
            onChange={(e) => handleChange(field.id, e.target.value)}
            helperText={error || field.description}
            InputLabelProps={{ shrink: true }}
          />
        );

      default:
        return null;
    }
  };

  if (!currentForm) {
    return (
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <Typography variant="h4">
            No form selected
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        {showSuccessMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Form submitted successfully!
          </Alert>
        )}

        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            {currentForm.name}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {currentForm.fields.map((field) => (
                <Box key={field.id}>
                  {renderField(field)}
                </Box>
              ))}

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ minWidth: 200 }}
                >
                  Submit Form
                </Button>
              </Box>
            </Stack>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default PreviewForm;
