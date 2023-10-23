import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const PaymentOk = () => {
    const { store, actions } = useContext(Context)
    const [status, setStatus] = useState("Loading")
    const navigate = useNavigate()

    useEffect(() => {
        // const validateToken = async () => {
        //     const valid = await actions.validToken()
        //     if (localStorage.getItem('dataCompra') !== null) {
        //         actions.crearPedido()
        //     } else {
        //         navigate("/")
        //     }
        // }
        actions.crearPedido()

    }, [])


    return (
        <div className="d-flex h-100 justify-content-center text-bg-dark bg-white">
            <div className=" min-vh-100 mt-5 text-center">
                <div className="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column text-center">
                    <main className="px-3">
                        <h1>Pago realizado con éxito!</h1>
                        <p className="lead">Ya estamos preparando tu pedido! En breve podrás disfrutar de los productos naturales en tu casa!</p>
                        <p className="lead">
                            <Link to={"/"} className="btn btn-lg btn-secondary fw-bold border-white bg-dark">Volver al incio</Link>
                        </p>
                    </main>
                </div>
            </div>
        </div>
    )
}