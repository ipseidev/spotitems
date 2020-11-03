import React from 'react';
import Index from '../../pages';
import Navbar from '../Navigation/Navbar';
import {  QueryCache, ReactQueryCacheProvider } from 'react-query';


const queryCache = new QueryCache();


function App() {
  return (
    <ReactQueryCacheProvider queryCache={queryCache}>
      <Navbar />
      <Index />
    </ReactQueryCacheProvider>
  );
}

export default App;
