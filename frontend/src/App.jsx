import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './component/Home';

const App = () => {
  return (
    <React.Fragment>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </React.Fragment>
  );
};

export default App;
