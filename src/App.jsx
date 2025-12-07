import { Routes, Route } from 'react-router-dom';
import Index from './components/Index';
import Generate from './components/Generate';
import Gallery from './components/Gallery';
import Contract from './components/Contract';
import Cursor from './components/Cursor'; // 1. 引入组件

function App() {
  return (
    <>
      {/* 2. 放置光标组件 */}
      <Cursor />
      
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/generate" element={<Generate />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contract" element={<Contract />} />
      </Routes>
    </>
  );
}

export default App;