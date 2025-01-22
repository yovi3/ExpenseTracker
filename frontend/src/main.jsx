import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './css/index.css'
import MainPage from './mainPage.jsx';
import ViewExpenses from './viewExpenses.jsx';
import EnhancedTableWithFilter from './test.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/expenses" element={<ViewExpenses />} />
        <Route path="/test" element={<EnhancedTableWithFilter />} />
      </Routes>
    </BrowserRouter>
)
