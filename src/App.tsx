import { Provider } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import CreateForm from './pages/CreateForm';
import PreviewForm from './pages/PreviewForm';
import MyForms from './pages/MyForms';
import { store } from './store';
import theme from './theme';
import Layout from './components/Layout';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Layout>
            <Routes>
              <Route path="/create" element={<CreateForm />} />
              <Route path="/preview" element={<PreviewForm />} />
              <Route path="/myforms" element={<MyForms />} />
              <Route path="/" element={<Navigate to="/create" replace />} />
            </Routes>
          </Layout>
        </Router>
      </ThemeProvider>
    </Provider>
  )
}

export default App
