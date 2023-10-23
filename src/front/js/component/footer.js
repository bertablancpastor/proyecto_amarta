import React, { Component } from "react";
import "../../styles/home.css";

export const Footer = () => (
	<footer className="footer mt-auto py-3 text-center ">
		<p >
			Hecho con <i className="fa-solid fa-heart" style={{ color: "#ffffff" }}></i>
			<span> de </span>
			<a href="http://www.linkedin.com/in/jose-david-parra-barreto-9b98761a5" className="text-white link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"> Jose, </a>
			<a href="https://www.linkedin.com/in/berta-blanc-pastor-2b98b84b" className="text-white link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">Berta y</a>
			<a href="https://www.linkedin.com/in/laura-espi%C3%B1o-84b261163/" className="text-white link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"> Laura</a>
		</p>
	</footer>
);
