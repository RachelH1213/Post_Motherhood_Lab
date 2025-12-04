import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './components/Index';
import Generate from './components/Generate';
import Gallery from './components/Gallery';
import Contract from './components/Contract';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contract" element={<Contract />} />
      </Routes>
    </Router>
  );
}

export default App;
