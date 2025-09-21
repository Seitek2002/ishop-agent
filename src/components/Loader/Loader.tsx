import React from 'react';
import loader from '../../assets/loader.svg';

const Loader = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <img src={loader} alt='Loader' />
    </div>
  );
};

export default Loader;
