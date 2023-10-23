import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";

export const PaymentNotOk = () => {
    const { store, actions } = useContext(Context)
    const [stripePromise, setStripePromise] = useState(null)
    const [clientSecret, setClientSecret] = useState(null)
    const navigate = useNavigate()

    useEffect(localStorage.removeItem("id"), [])

    return (
        <div className="d-flex h-100 justify-content-center text-bg-dark bg-white">
            <div className=" min-vh-100 mt-5 text-center">
                <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column text-center">

                    <main className="px-3">
                        <h1>Ops ha habído un error con el pago!</h1>
                        <p className="lead">Revisa tus datos y vuelva a intentarlo de nuevo! Gracias</p>
                        <p className="lead">
                            <Link to={"/"} className="btn btn-lg btn-secondary fw-bold border-white bg-dark">Volver al incio</Link>
                        </p>
                    </main>
                </div>
            </div>
        </div>

    )
}