import "tailwindcss/tailwind.css";
import axios from "axios";
import Header from "../components/header";

function AppComponent({ Component, pageProps, data }) {
  console.log({ data });
  return (
    <div>
      <Header currentUserCtx={data} />
      <Component {...pageProps} />
    </div>
  );
}

AppComponent.getInitialProps = async (appContext) => {
  // console.log("App Component");
  try {
    if (typeof window === "undefined") {
      // 1. Make request to Ingress-srv http://ingress-nginx.ingress-nginx-controller/api/users/currentuser

      const {
        data,
      } = await axios.get(
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
        { headers: appContext.ctx.req.headers }
      );

      let pageProps = {};

      if (appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
      }
      // console.log(data);
      return {
        pageProps,
        ...data,
      };
    } else {
      const { data } = await axios.get("/api/users/currentuser");
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
    console.log("Ohh AppComponent err");
    console.log(error.response.data);
    let pageProps = {};

    if (appContext.Component.getInitialProps) {
      pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }

    return { pageProps, data: error.response.data || {} };
  }
};

export default AppComponent;
