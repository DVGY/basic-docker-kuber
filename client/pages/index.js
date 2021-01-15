import axios from "axios";
import ErrorDisplay from "../components/error";

const HomePage = (currentUserContext) => {
  console.log({currentUserContext});

  if (currentUserContext.data.status === "Error") {
    return <ErrorDisplay error={currentUserContext.data}></ErrorDisplay>;
  }

  return (
    <h1 className="">Landing page:{JSON.stringify(currentUserContext.data)}</h1>
  );
};

HomePage.getInitialProps = async ({ req }) => {
  // let resp;
  // console.log({ req });
  console.log("Homepage");
  try {
    if (typeof window === "undefined") {
      // 1. Make request to Ingress-srv http://ingress-nginx.ingress-nginx-controller/api/users/currentuser
      const {
        data,
      } = await axios.get(
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
        { headers: req.headers }
      );
      // console.log({ data });
      // const found = isCyclic(resp);
      // 2. Send all the headers,cookie or req object as while other wise recive 404 err
      // console.log(found);
      return data;
    } else {
      const { data } = await axios.get("/api/users/currentuser");
      // Eg if we are on signup page and gets to current user
      // Make request normally like in client /api/users/currentuser
      return data;
    }
    // console.log(resp);
  } catch (error) {
    console.log("Ohh Homepage err");
    console.log(error.response.data);
    // let pageProps = {};

    // if (appContext.Component.getInitialProps) {
    //   pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    // }

    return { data: error.response.data || {} };
  }
};

export default HomePage;
