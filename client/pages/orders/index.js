import React from 'react';
import Axios from 'axios';

const OrderIndex = ({ orders }) => {
  const orderList = orders.data.map((order) => {
    const { price, title } = order.ticket;
    return (
      <tr key={order.id}>
        <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-black-900 text-sm leading-5'>
          {title}
        </td>
        <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-black-900 text-sm leading-5'>
          {price}
        </td>
        <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-black-900 text-sm leading-5'>
          {order.status}
        </td>
        <td className='px-6 py-4 whitespace-no-wrap border-b border-gray-500 text-black-900 text-sm leading-5'>
          {order.id}
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
                Order Status
              </th>
              <th className='px-6 py-3 border-b-2 border-gray-300 text-left text-sm leading-4 text-purple-500 tracking-wider'>
                Order Id
              </th>

              <th className='px-6 py-3 border-b-2 border-gray-300'></th>
            </tr>
          </thead>

          <tbody className='bg-white'>{orderList}</tbody>
        </table>
      </div>
    </div>
  );
};

OrderIndex.getInitialProps = async ({ req }) => {
  try {
    if (typeof window === 'undefined') {
      // 1. Make request to Ingress-srv http://ingress-nginx.ingress-nginx-controller/api/users/currentuser
      const {
        data,
      } = await Axios.get(
        `http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/orders`,
        { headers: req.headers }
      );
      // 2. Send all the headers,cookie or req object as while other wise recive 404 err

      return { orders: data };
    } else {
      const { data } = await Axios.get(`/api/orders`);
      // Eg if we are on signup page and gets to current user
      // Make request normally like in client /api/users/currentuser
      return { orders: data };
    }
  } catch (error) {
    console.log('Ohh Homepage err');
    console.log(error);
    console.log(error.response.data);

    return { data: error.response.data || {} };
  }
};

export default OrderIndex;
