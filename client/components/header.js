import TicketSVG from '../asset/ticket-svg';
import Link from 'next/link';

const Header = ({ currentUser }) => {
  return (
    <nav className='bg-gray-800'>
      <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
        <div className='relative flex items-center justify-between h-16'>
          <div className='flex-1 flex items-center justify-center sm:items-stretch sm:justify-start'>
            <div className='flex-shrink-0 flex items-center'>
              <Link href='/'>
                <a>
                  <TicketSVG />
                </a>
              </Link>
            </div>
          </div>
          <div className=' inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
            {!currentUser && (
              <Link href='/auth/signin'>
                <a className='bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white ml-6'>
                  Login
                </a>
              </Link>
            )}
            {currentUser && (
              <Link href='/tickets/new'>
                <a className='bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white ml-6'>
                  Create Ticket
                </a>
              </Link>
            )}
            {currentUser && (
              <Link href='/orders'>
                <a className='bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white ml-6'>
                  My Orders
                </a>
              </Link>
            )}
            {currentUser && (
              <Link href='/auth/signout'>
                <a className='bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white ml-6'>
                  Logout
                </a>
              </Link>
            )}

            {!currentUser && (
              <Link href='/auth/signup'>
                <a className='bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white ml-6'>
                  Sign Up
                </a>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
