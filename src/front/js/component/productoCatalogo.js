import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "../../styles/producto-catalogo.css";
import { Context } from "../store/appContext";
import "../../styles/carrito.css"

export const ProductoCatalogo = props => {
    const { store, actions } = useContext(Context)
    const [faved, setFaved] = useState()
    const [compras, setCompras] = useState(false)
    const [cantidad, setCantidad] = useState(1)



    // Comenzar aqui

    function handleComprar() {
        actions.agregarAlCarrito(props.producto, cantidad);
    }
    // CODIGO A PARTIR DE AQUI JOSE (línea 41)
    function handleOnClickFav() {
        if (store.logged) {
            actions.toggleFav(props.producto.id_producto)
            if (faved) {
                setFaved(false)
            } else if (!faved) {
                setFaved(true)
            }

        } else {
            alert("No hay ningun usuario loggeado")
        }


    }
    useEffect(() => {
        let isFaved = actions.prodIsFaved(props.producto.id_producto)
        if (isFaved) {
            setFaved(isFaved)
        }
    }, [faved])




    return (

        <div className="card col-12 col-md-6 col-lg-3 mx-3 border-0 m-2 p-0 position-relative" style={{ width: "18rem" }}>
            <img src={props.producto.url_img} className="card-img-top max" alt="..." />
            <div className="card-body container">
                <div className="d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0 ">{props.producto.nombre}</h5>
                    <p className="fw-lighter mb-0">{props.producto.precio} €</p>
                </div>
                <div className="d-flex flex-start">
                    <p className="text-end fw-lighter">{props.producto.ingredientes_principales}</p>
                </div>

                <div className="d-flex justify-content-between">
                    <Link to={`/producto/${props.producto.id_producto}`} type="button" className="btn btn-dark ">Más información</Link>
                    <a href="#" className="btn btn-white pe-1" onClick={handleComprar}><i className="fa-solid fa-cart-shopping"></i></a>

                </div>

                <div className="d-flex justify-content-end">
                    {faved ?
                        <button className="  bg-transparent border-0 position-absolute top-0" type="button" onClick={handleOnClickFav}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-heart-fill" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                            </svg>
                        </button> :
                        <button className="bg-transparent border-0 position-absolute top-0" type="button" onClick={handleOnClickFav}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fillRule="currentColor" className="bi bi-heart" viewBox="0 0 16 16">
                                <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                            </svg>
                        </button>
                    }
                </div>

            </div>
        </div>
    );
};


/**
 * Define the data-types for
 * your component's properties
 **/
ProductoCatalogo.propTypes = {
    producto: PropTypes.object,
    pedido: PropTypes.object
};


