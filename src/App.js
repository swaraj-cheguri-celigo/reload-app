import React from 'react';
import Form from './components/Form';
import { useSelector } from 'react-redux';

const App = () => {
  const formData = useSelector((state) => state.form);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>zSimdrepere3r34ewqew</h1>
      <Form />
      <h2>fdfdsf :</h2>
      <pre>{JSON.stringify(formData, null, 2)}</pre>
    </div>
  );
};

export default App;