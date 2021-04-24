import 'tailwindcss/tailwind.css';
import Axios from 'axios';
import Header from '../components/header';

function AppComponent({ Component, pageProps, data }) {
  const { currentUser } = data;
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component currentUser={currentUser} {...pageProps} />
    </div>
  );
}

AppComponent.getInitialProps = async (appContext) => {
  try {
    // If the request is from server side
    if (typeof window === 'undefined') {
      // 1. Make request to Ingress-srv http://ingress-nginx.ingress-nginx-controller/api/users/currentuser

      // cross namespace communication
      // namespace : ingress-ngnix
      // service: ingress-ngnix
      const {
        data,
      } = await Axios.get(
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser',
        { headers: appContext.ctx.req.headers }
      );

      let pageProps = {};

      if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
      }
      return {
        pageProps,
        ...data,
      };
    } else {
      // If the request is from browser
      const { data } = await Axios.get('/api/users/currentuser');
      let pageProps = {};

      if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
      }
      // Eg if we are on signup page and gets to current user
      // Make request normally like in client /api/users/currentuser
      return {
        pageProps,
        ...data,
        // ...resp,
      };
    }

    // console.log({ pageProps });
    // 2. Send all the headers,cookie or req object as while other wise recive 404 err
  } catch (error) {
    console.log('Ohh AppComponent err');
    console.log(error);
    console.log(error.response.data);
    let pageProps = {};

    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }

    return { pageProps, data: error.response.data || {} };
  }
};

export default AppComponent;
