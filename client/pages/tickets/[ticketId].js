import React, { useState } from 'react';
import Axios from 'axios';
import Router from 'next/router';

import TicketSVG from '../../asset/ticket-svg';
import ErrorDisplay from '../../components/error';

const TicketShow = ({ ticket }) => {
  const { title, price, id } = ticket.data[0];
  const [error, setError] = useState('');

  const handlePurchase = async (e) => {
    try {
      const { data } = await Axios.post('/api/orders', {
        ticketId: id,
      });
      const orderId = data.data.id;
      Router.push('/orders/[orderId]', `/orders/${orderId}`);
    } catch (error) {
      console.log(error);
      setError(error.response.data);
    }
  };

  return (
    <div>
      <div className='flex items-center justify-center'>
        <div className='relative bg-white py-6 px-6 rounded-3xl w-64 my-4 shadow-xl'>
          <div className=' text-white flex items-center absolute rounded-full py-4 px-4 shadow-xl bg-purple-100 left-4 -top-2'>
            <TicketSVG height={20} width={20} />
          </div>
          <div className='mt-8'>
            <p className='text-xl font-semibold my-2'>{title}</p>
            <p className='text-xl font-semibold my-2'>$: {price}</p>
          </div>
          <button
            onClick={handlePurchase}
            className='bg-purple-500 px-4 py-2 text-xs font-semibold tracking-wider text-white rounded hover:bg-green-600'
          >
            Purchase
          </button>
        </div>
      </div>
      <div className='flex items-center justify-center'>
        {error && <ErrorDisplay error={error} />}
      </div>
    </div>
  );
};

TicketShow.getInitialProps = async ({ query, req }) => {
  const { ticketId } = query;
  try {
    if (typeof window === 'undefined') {
      // 1. Make request to Ingress-srv http://ingress-nginx.ingress-nginx-controller/api/users/currentuser
      const {
        data,
      } = await Axios.get(
        `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/tickets/${ticketId}`,
        { headers: req.headers }
      );
      console.log({ data });
      // const found = isCyclic(resp);
      // 2. Send all the headers,cookie or req object as while other wise recive 404 err
      // console.log(found);
      return { ticket: data };
    } else {
      const { data } = await Axios.get(`/api/tickets/${ticketId}`);
      // Eg if we are on signup page and gets to current user
      // Make request normally like in client /api/users/currentuser
      return { ticket: data };
    }
    // console.log(resp);
  } catch (error) {
    console.log('Ohh Homepage err');
    console.log(error);
    console.log(error.response.data);
    // let pageProps = {};

    // if (appContext.Component.getInitialProps) {
    //   pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    // }

    return { data: error.response.data || {} };
  }
};

export default TicketShow;
