import { useState, useEffect } from "react";
import Axios from "axios";
import Router from "next/router";

import ErrorDisplay from "../../components/error";

const SignOut = (props) => {
  console.log({ props });
  const [error, setError] = useState("");

  useEffect(() => {
    async function signoutUser() {
      try {
        const response = await Axios.get("/api/users/signout");
        console.log("SignOut successfully");
        Router.push("/auth/signup");
      } catch (error) {
        // console.log(error);
        setError(error.response.data);
      }
    }
    signoutUser();
  }, []);
  if (error) {
    return <ErrorDisplay error={error} />;
  }
  return <div>You are logged out</div>;
};

export default SignOut;
