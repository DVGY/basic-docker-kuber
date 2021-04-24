import React, { useState } from 'react';
import Axios from 'axios';
import Router from 'next/router';
import Link from 'next/link';

import ErrorDisplay from '../../components/error';

const NewTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState('');

  const onBlur = () => {
    let value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }
    if (value < 0) {
      value = Math.abs(value);
    }
    setPrice(value.toFixed(2));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios.post('/api/tickets', {
        title,
        price,
      });
      Router.push('/');
    } catch (error) {
      setError(error.response.data);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col items-center'>
      <label
        htmlFor='title'
        className='mt-4 mb-1 uppercase text-grey-darker text-xs font-bold items-start'
      >
        Title
      </label>
      <div className='flex flex-row'>
        <span className='flex items-center bg-grey rounded rounded-r-none px-3 font-bold text-grey-darker'>
          T
        </span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          name='title'
          className='bg-grey-lighter text-grey-darker py-2 font-normal rounded text-grey-darkest border border-purple-300 rounded-l-none font-bold'
        />
      </div>
      <label
        htmlFor='price'
        className='mt-4 mb-1 uppercase text-grey-darker text-xs font-bold'
      >
        price
      </label>
      <div className='flex flex-row'>
        <span className='flex items-center bg-grey-lighter rounded rounded-r-none px-3 font-bold text-grey-darker'>
          $
        </span>
        <input
          onBlur={onBlur}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          name='price'
          className='bg-grey-lighter text-grey-darker py-2 font-normal rounded text-grey-darkest border border-purple-300 rounded-l-none font-bold'
        />
      </div>
      <button className='bg-purple-600 px-4 py-2 mt-4 mb-1 text-sm font-semibold tracking-wider text-white rounded hover:bg-green-600'>
        Create Ticket
      </button>
      {error && <ErrorDisplay error={error} />}
    </form>
  );
};

export default NewTicket;
