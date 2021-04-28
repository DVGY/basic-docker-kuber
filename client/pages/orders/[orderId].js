import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import Router from 'next/router';
import StripeCheckout from 'react-stripe-checkout';

const OrderShow = ({ order }) => {
  const [timeLeft, setTimeLeft] = useState({
    minutes: 0,
    second: 0,
  });
  const [error, setError] = useState('');

  const { expiresAt, ticket, id } = order.data;

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(expiresAt) - new Date();
      const minutesLeft = Math.floor(msLeft / 60000);
      const secondsLeft = Math.floor((msLeft % 60000) / 1000);
      setTimeLeft({ minutes: minutesLeft, second: secondsLeft });
    };
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  const handlePayment = async (token) => {
    try {
      const response = await Axios.post('/api/payments', {
        orderId: id,
        token: token.id,
      });
      Router.push(`/`);
    } catch (error) {
      console.log(error);
      setError(error.response.data);
    }
  };

  if (timeLeft.second < 0) {
    return (
      <div className='max-w-full mx-4 py-6 sm:mx-auto sm:px-6 lg:px-8'>
        <div className='sm:flex sm:space-x-4'>
          <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow transform transition-all mb-4 w-full sm:w-1/3 sm:my-8'>
            <div className='bg-white p-5'>
              <div className='sm:flex sm:items-start'>
                <div className='text-center sm:mt-0 sm:ml-2 sm:text-left'>
                  <h3 className='text-sm leading-6 font-medium text-gray-400'>
                    Order Expired
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-full mx-4 py-6 sm:mx-auto sm:px-6 lg:px-8'>
      <div className='sm:flex sm:space-x-4'>
        <div className='inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow transform transition-all mb-4 w-full sm:w-1/3 sm:my-8'>
          <div className='bg-white p-5'>
            <div className='sm:flex sm:items-start'>
              <div className='text-center sm:mt-0 sm:ml-2 sm:text-left'>
                <h3 className='text-sm leading-6 font-medium text-gray-400'>
                  Time Left
                </h3>
                <p className='text-3xl font-bold text-red-600'>
                  {timeLeft.minutes}:{timeLeft.second}
                </p>
                <StripeCheckout
                  token={(token) => handlePayment(token)}
                  stripeKey='pk_test_51IhbXISG1qmm1Y3dE9l2HV0HtZbWNV7iEcnQKelc0TIKlwzIX82HGiW9jHsdTlgyy8O7suewjCoxKj93ca8wjcVe00C0LMS29j'
                  amount={ticket.price * 100}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

OrderShow.getInitialProps = async ({ query, req }) => {
  const { orderId } = query;

  try {
    if (typeof window === 'undefined') {
      // 1. Make request to Ingress-srv http://ingress-nginx.ingress-nginx-controller/api/users/currentuser
      const {
        data,
      } = await Axios.get(
        `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/orders/${orderId}`,
        { headers: req.headers }
      );
      // const found = isCyclic(resp);
      // 2. Send all the headers,cookie or req object as while other wise recive 404 err
      // console.log(found);
      return { order: data };
    } else {
      const { data } = await Axios.get(`/api/orders/${orderId}`);
      // Eg if we are on signup page and gets to current user
      // Make request normally like in client /api/users/currentuser
      return { order: data };
    }
    // console.log(resp);
  } catch (error) {
    console.log('Show Order Error');
    console.log(error);
    console.log(error.response.data);
    // let pageProps = {};

    // if (appContext.Component.getInitialProps) {
    //   pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    // }

    return { data: error.response.data || {} };
  }
};
export default OrderShow;
