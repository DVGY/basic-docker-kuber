import Axios from 'axios';
import Link from 'next/link';
import React from 'react';
import ErrorDisplay from '../components/error';

const HomePage = ({ currentUser, tickets }) => {
  const ticketList = tickets.data.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-black-900 text-sm leading-5'>
          {ticket.title}
        </td>
        <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-black-900 text-sm leading-5'>
          {ticket.price}
        </td>
        <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-black-900 text-sm leading-5'>
          <Link href='/tickets/[ticketId]' as={`/tickets/${ticket.id}`}>
            <a className='px-5 py-2 border-black-500 border text-black-500 rounded hover:bg-purple-300 hover:text-purple-500 focus:outline-none'>
              Details
            </a>
          </Link>
        </td>
      </tr>
    );
  });
  return (
    <div className='-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 pr-10 lg:px-8'>
      <div className='align-middle inline-block min-w-full  overflow-hidden bg-white shadow-dashboard px-8 pt-3'>
        <table className='min-w-full'>
          <thead>
            <tr>
              <th className='px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-purple-500 tracking-wider'>
                Title
              </th>
              <th className='px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-purple-500 tracking-wider'>
                Price
              </th>
              <th className='px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-purple-500 tracking-wider'>
                View
              </th>

              <th className='px-6 py-3 border-b-2 border-gray-300'></th>
            </tr>
          </thead>

          <tbody className='bg-white'>{ticketList}</tbody>
        </table>
      </div>
    </div>
  );
};

HomePage.getInitialProps = async ({ req }) => {
  // // let resp;
  // console.log("Homepage");
  try {
    if (typeof window === 'undefined') {
      // 1. Make request to Ingress-srv http://ingress-nginx.ingress-nginx-controller/api/users/currentuser
      const {
        data,
      } = await Axios.get(
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/tickets',
        { headers: req.headers }
      );
      // const found = isCyclic(resp);
      // 2. Send all the headers,cookie or req object as while other wise recive 404 err
      // console.log(found);
      return { tickets: data };
    } else {
      const { data } = await Axios.get('/api/tickets');
      // Eg if we are on signup page and gets to current user
      // Make request normally like in client /api/users/currentuser
      return { tickets: data };
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

export default HomePage;
