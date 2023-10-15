//import react into the bundle
import React from "react";
import ReactDOM from "react-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

//include your index.scss file into the bundle
import "../styles/index.css";

//import your own components
import Layout from "./layout";

//render your react application
ReactDOM.render(<GoogleOAuthProvider clientId="726010529681-apcp72gotrv8cr1tq7pg0ukmqcvubocm.apps.googleusercontent.com"><Layout /></GoogleOAuthProvider>, document.querySelector("#app"));
