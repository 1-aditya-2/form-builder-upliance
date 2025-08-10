import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date' | 'email' | 'password';

export type ValidationRuleType = 
  | 'required' 
  | 'minLength' 
  | 'maxLength' 
  | 'email' 
  | 'password' 
  | 'min' 
  | 'max' 
  | 'pattern'
  | 'custom';

export interface ValidationRule {
  type: ValidationRuleType;
  value?: any;
  message: string;
  pattern?: string;
}

export interface DerivedFieldConfig {
  parentFields: string[];
  formula: string;
  description: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  name: string;
  placeholder?: string;
  required: boolean;
  defaultValue?: any;
  validations: ValidationRule[];
  options?: { label: string; value: string }[];
  derivedField?: DerivedFieldConfig;
  order: number;
  minValue?: number;
  maxValue?: number;
  multiple?: boolean;
  isPasswordField?: boolean;
  isEmailField?: boolean;
}

export interface Form {
  id: string;
  name: string;
  fields: FormField[];
  createdAt: string;
}

interface FormBuilderState {
  forms: Form[];
  currentForm: Form | null;
}

const initialState: FormBuilderState = {
  forms: [],
  currentForm: null,
};

const formBuilderSlice = createSlice({
  name: 'formBuilder',
  initialState,
  reducers: {
    setCurrentForm: (state, action: PayloadAction<Form | null>) => {
      state.currentForm = action.payload;
    },
    addForm: (state, action: PayloadAction<Form>) => {
      state.forms.push(action.payload);
      localStorage.setItem('forms', JSON.stringify(state.forms));
    },
    updateForm: (state, action: PayloadAction<Form>) => {
      const index = state.forms.findIndex(form => form.id === action.payload.id);
      if (index !== -1) {
        state.forms[index] = action.payload;
        localStorage.setItem('forms', JSON.stringify(state.forms));
      }
    },
    loadForms: (state) => {
      const savedForms = localStorage.getItem('forms');
      if (savedForms) {
        state.forms = JSON.parse(savedForms);
      }
    },
  },
});

export const { setCurrentForm, addForm, updateForm, loadForms } = formBuilderSlice.actions;
export default formBuilderSlice.reducer;
