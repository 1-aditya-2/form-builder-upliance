import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Chip,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import type { FormField, ValidationRule, ValidationRuleType } from '../features/formBuilder/formBuilderSlice';

interface ValidationRulesSectionProps {
  field: FormField;
  onUpdate: (updates: Partial<FormField>) => void;
}

const validationTypes: { type: ValidationRuleType; label: string }[] = [
  { type: 'required', label: 'Required' },
  { type: 'minLength', label: 'Minimum Length' },
  { type: 'maxLength', label: 'Maximum Length' },
  { type: 'email', label: 'Email Format' },
  { type: 'password', label: 'Password Rules' },
  { type: 'min', label: 'Minimum Value' },
  { type: 'max', label: 'Maximum Value' },
  { type: 'pattern', label: 'Custom Pattern' },
];

const ValidationRulesSection = ({ field, onUpdate }: ValidationRulesSectionProps) => {
  const [newRuleType, setNewRuleType] = useState<ValidationRuleType>('required');
  const [newRuleValue, setNewRuleValue] = useState('');
  const [newRuleMessage, setNewRuleMessage] = useState('');

  const getDefaultMessage = (type: ValidationRuleType, value?: string): string => {
    switch (type) {
      case 'required':
        return 'This field is required';
      case 'minLength':
        return `Minimum length is ${value} characters`;
      case 'maxLength':
        return `Maximum length is ${value} characters`;
      case 'email':
        return 'Please enter a valid email address';
      case 'password':
        return 'Password must be at least 8 characters and contain both letters and numbers';
      case 'min':
        return `Value must be at least ${value}`;
      case 'max':
        return `Value must not exceed ${value}`;
      case 'pattern':
        return 'Value does not match the required pattern';
      default:
        return '';
    }
  };

  const handleAddRule = () => {
    const newRule: ValidationRule = {
      type: newRuleType,
      message: newRuleMessage || getDefaultMessage(newRuleType, newRuleValue),
    };

    if (newRuleValue) {
      if (newRuleType === 'pattern') {
        newRule.pattern = newRuleValue;
      } else {
        newRule.value = newRuleType === 'min' || newRuleType === 'max' ? Number(newRuleValue) : newRuleValue;
      }
    }

    const updatedValidations = [...field.validations, newRule];
    onUpdate({ validations: updatedValidations });

    // Reset form
    setNewRuleType('required');
    setNewRuleValue('');
    setNewRuleMessage('');
  };

  const handleRemoveRule = (index: number) => {
    const updatedValidations = field.validations.filter((_, i) => i !== index);
    onUpdate({ validations: updatedValidations });
  };

  const needsValue = (type: ValidationRuleType): boolean => {
    return ['minLength', 'maxLength', 'min', 'max', 'pattern'].includes(type);
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle2" gutterBottom>
        Validation Rules
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Rule Type</InputLabel>
          <Select
            value={newRuleType}
            onChange={(e) => setNewRuleType(e.target.value as ValidationRuleType)}
            label="Rule Type"
          >
            {validationTypes.map((vType) => (
              <MenuItem key={vType.type} value={vType.type}>
                {vType.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {needsValue(newRuleType) && (
          <TextField
            size="small"
            label="Value"
            value={newRuleValue}
            onChange={(e) => setNewRuleValue(e.target.value)}
            type={['min', 'max', 'minLength', 'maxLength'].includes(newRuleType) ? 'number' : 'text'}
            sx={{ minWidth: 120 }}
          />
        )}

        <TextField
          size="small"
          label="Custom Message"
          value={newRuleMessage}
          onChange={(e) => setNewRuleMessage(e.target.value)}
          placeholder="Optional"
          sx={{ flexGrow: 1 }}
        />

        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddRule}
          disabled={needsValue(newRuleType) && !newRuleValue}
        >
          Add Rule
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {field.validations.map((rule, index) => (
          <Chip
            key={index}
            label={`${validationTypes.find(t => t.type === rule.type)?.label}${
              rule.value ? `: ${rule.value}` : ''
            }`}
            onDelete={() => handleRemoveRule(index)}
            color="primary"
            variant="outlined"
          />
        ))}
      </Box>
    </Box>
  );
};

export default ValidationRulesSection;
