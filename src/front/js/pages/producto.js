import React, { useState, useEffect, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import "../../styles/producto.css";

export const Producto = () => {
    const { store, actions } = useContext(Context);
    // const [filter, setFilter] = useState("")
    const params = useParams()
    const [loaded, setLoaded] = useState(false)
    const [cantidad, setCantidad] = useState(1)
    const navigate = useNavigate()

    async function handleAddCarrito() {
        const added = await actions.agregarAlCarrito(store.producto, parseInt(cantidad))
        if (added) {
            console.log("added to carrito");
        } else {
            // console.log("error");
        }

    }
    useEffect(() => {
        console.log("page producto", params.id_producto);
        async function loadProduct() {
            const load = await actions.getOneProduct(params.id_producto)
            if (load) {
                setLoaded(true)
            } else {
                navigate("/")
                alert("ALGO SALIO MAL")
            }
        }
        loadProduct()

    }, [loaded])

    if (!loaded) {
        return (
            <h1 className="text-center">LOADING...</h1>
        )
    }

    return (
        <div className="container col-xxl-8 px-4 py-5 mt-5 mb-5 min-vh-100">
            <div className="contenedor row flex-lg-row bg-white align-items-center p-4">
                <div className="col-10 col-sm-8 col-lg-6">
                    <img src={store.producto.url_img} className="d-block mx-lg-auto img-fluid mb-4" alt="Bootstrap Themes" loading="lazy" />
                    <p className="blockquote-footer">{store.producto.ingredientes_tecnicos}</p>
                </div>
                <div className="col-lg-6">
                    <h1 className="display-6 fw-bold lh-1 mb-3">{store.producto.nombre}</h1>
                    <p>{store.producto.propiedes}</p>
                    <p className="lead">{store.producto.descripcion}</p>
                    <p>{store.producto.metodo_utilizacion}</p>

                    <hr />

                    <div className="d-flex justify-content-around align-items-center">
                        <input value={cantidad} min={1} max={99} className="form-control w-auto me-2" type="number" onChange={(e) => {
                            setCantidad(e.target.value)
                        }} />
                        <label className="form-check-label" htmlFor="flexRadioDefault1">
                            unidad {store.producto.tamaño}
                        </label>
                        <div className="ms-auto fw-bold">{store.producto.precio} €</div>
                    </div>
                    <hr />

                    <div className="d-grid gap-2 d-md-flex justify-content-md-start mt-5">

                        <button onClick={handleAddCarrito} type="button" className="btn btn-dark btn-lg px-4 me-md-2">Añadir al
                            carrito</button>
                        <Link to={"/catalogo"} type="button" className="btn btn-outline-secondary btn-lg px-4">Seguir comprando</Link>
                    </div>
                </div>
            </div>
        </div>



    );
};