import React, { useContext, useState, useEffect, useRef } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { ProductoCatalogo } from "../component/productoCatalogo";
import "../../styles/pedido.css";
import Swal from 'sweetalert2'


export const Private = () => {
    const { store, actions } = useContext(Context)
    const [status, setStatus] = useState("checking")
    const navigate = useNavigate()
    const [direccion, setDireccion] = useState("")
    const [ciudad, setCiudad] = useState("")
    const [codigo_postal, setCodigoPostal] = useState("")
    const [cambio, setCambio] = useState(false)
    const ref = useRef(null);

    function logFavs() {
        console.log(store.favs);
    }

    function getPedidoUnico(pedidos) {
        const pedidoId = new Set();
        let contadorPedido = 0;

        for (const pedido of pedidos) {
            if (!pedidoId.has(pedido.id_pedido)) {
                pedidoId.add(pedido.id_pedido);
                contadorPedido++;
            }
        }

        return contadorPedido;
    }

    function getPedidosPorReferencia(pedidos) {
        const pedidosPorReferencia = {};

        for (const pedido of pedidos) {
            const referencia = pedido.id_pedido;

            if (!pedidosPorReferencia[referencia]) {
                pedidosPorReferencia[referencia] = [pedido];
            } else {
                pedidosPorReferencia[referencia].push(pedido);
            }
        }

        return Object.values(pedidosPorReferencia);
    }


    function handleActualizarDatos(e) {
        e.preventDefault()
        actions.actualizarDatos(direccion, ciudad, codigo_postal)
        // if (cambio === true) {            
        Swal.fire({
            text: 'Datos actualizados',
            customClass: {
                confirmButton: 'btn bg-dark btn-secondary',
            },
            buttonsStyling: false,
        });
        // } else {
        //     Swal.fire({
        //         text: 'No se han modificado los datos',
        //         icon: 'error',
        //         title: 'Oops...',
        //         customClass: {
        //           confirmButton: 'btn bg-dark btn-secondary',
        //         },
        //         buttonsStyling: false,
        //       });
        // }

    }

    console.log(store.user);
    console.log(store.user.ciudad);
    console.log(ciudad);

    useEffect(() => {
        const validate = async () => {
            let valid = await actions.validToken()
            setCiudad(store.user?.ciudad)
            setDireccion(store.user?.direccion)
            setCodigoPostal(store.user?.codigo_postal)
            if (valid) {
                const gotPedidos = await actions.getPedidos()
                const gotFavs = await actions.getFavs()
                setStatus("authorized")
                console.log(store.pedidos)
                return true
            } else {
                setStatus("un-authorized")
                return false
            }
        }
        validate()
        
    }, [])

    if (status === "authorized") {
        return (
            <div className="container-fluid bg-secondary-subtle p-5 bg-white bg-opacity-50 flex-grow-1 min-vh-100 text-center">
                <div className="container text-center">
                    <h1 className="title">Hola, {store.user.nombre}!</h1>

                    <form onSubmit={handleActualizarDatos}>
                        <div className="container text-center">
                            <div className="row">
                                <div className="col">
                                    <div className="mt-2 mb-2">
                                        <p className="h4">Información del cliente</p>
                                        <div className="input-group mb-2">
                                            <span className="input-group-text bg-white" id="inputGroup-sizing-default">Nombre</span>
                                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={store.user.nombre}
                                                readOnly />
                                        </div>
                                        <div className="input-group mb-2">
                                            <span className="input-group-text bg-white" id="inputGroup-sizing-default">Apellidos</span>
                                            <input type="text" className="form-control " aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={store.user.apellido}
                                                readOnly />
                                        </div>
                                        <div className="input-group mb-2 ">
                                            <span className="input-group-text bg-white" id="inputGroup-sizing-default">Email</span>
                                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" value={store.user.email}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col">
                                    <div className="mt-2 mb-2">
                                        <p className="h4">Dirección de envío</p>
                                        <div className="input-group mb-2">
                                            <span className="input-group-text bg-white" id="inputGroup-sizing-default">Dirección</span>
                                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default"
                                                defaultValue={store.user?.direccion ? store.user?.direccion : ""}
                                                onChange={(e) => 
                                                    setDireccion(e.target.value)
                                                }
                                                ref={ref}
                                            />
                                        </div>
                                        <div className="input-group mb-2">
                                            <span className="input-group-text bg-white" id="inputGroup-sizing-default">Municipio</span>
                                            <input type="text" className="form-control " aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={store.user?.ciudad ? store.user?.ciudad : ""}
                                                onChange={(e) => 
                                                    setCiudad(e.target.value)
                                                }
                                            ref={ref}

                                            />
                                        </div>
                                        <div className="input-group mb-2">
                                            <span className="input-group-text bg-white" id="inputGroup-sizing-default">Codigo Postal</span>
                                            <input type="text" className="form-control" aria-label="Sizing example input" aria-describedby="inputGroup-sizing-default" defaultValue={store.user?.codigo_postal ? store.user?.codigo_postal : ""}
                                                onChange={(e) => 
                                                    setCodigoPostal(e.target.value)
                                                }
                                                ref={ref}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="btn btn-dark btn-lg px-4 mt-3" type="submit">Actualizar Datos</button>
                    </form>

                    {/* FIN FORM */}

                    <hr></hr>




                    {/* FAVORITOS */}
                    <div id="arrayFavoritos">
                        <h4 className="d-flex justify-content-center mt-5">Tus favoritos {store.favs.length}</h4>
                        <div className="d-flex mb-2">
                            {store.favs.length === 0 ? (
                                <h5 className="d-block ms-5 mt-2 mb-2">Aún no tienes favoritos.
                                    <Link to={"/catalogo"} type="button" className=" h-50 w-100 d-block w-25 btn btn btn-dark btn-lg px-4 mt-3">Ir al catálogo</Link></h5>
                            ) : (
                                store.favs.map(item => (
                                    <ProductoCatalogo className="d-flex" key={item.id_producto} producto={item}></ProductoCatalogo>
                                ))
                            )}
                        </div>
                    </div>

                    <hr className=""></hr>
                    <div id="arrayPedidos" className="w-100 bg-transparent">
                        <h4 className="d-flex justify-content-center">
                            Tus pedidos {getPedidoUnico(store.pedidos)}
                        </h4>
                        <div className="accordion accodion-flush mx-0">
                            <div className=" mb-2 accordion-item w-100">
                                {store.pedidos.length === 0 ? (

                                    <h5 className=" ms-5 mt-2 mb-2">Aún no tienes pedidos.</h5>
                                ) : (
                                    <div className="justify-content-center accordion-item" id="accordionPedidos">
                                        {getPedidosPorReferencia(store.pedidos).map((groupedOrder, index) => (
                                            <div key={`${groupedOrder[0].id_pedido}-${index}`} className="row mb-4 accordion-header">
                                                <h2 className=" accordion-header w-100">
                                                    <button type="button" className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target={`#div${groupedOrder[0].id_pedido}`} aria-expanded="true" aria-controls="collapseOne">Referencia: {groupedOrder[0].id_pedido} ------ Fecha: {groupedOrder[0].fecha}</button>
                                                </h2>
                                                <div className="col-md-12 accordion-collapse collapse" id={`div${groupedOrder[0].id_pedido}`}>
                                                    <div className="accordion-body">
                                                        <div className="card-body">
                                                            {/* <h5 className="card-title">Referencia: {groupedOrder[0].id_pedido}</h5> */}
                                                            {groupedOrder.map((item, subIndex) => (
                                                                <div key={`${item.id_producto}-${subIndex}`}>
                                                                    <img src={`${item.img}`} className="imgPedido" />
                                                                    <p className="card-text mb-0">Producto: {item.nombre}</p>
                                                                    <p className="card-text mb-2">Cantidad: {item.cantidad}</p>
                                                                    <hr></hr>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (status === "un-authorized") {
        return (
            <Navigate to="/" replace />
        )
    }

    return (
        <>
            <div className="mt-3 text-center min-vh-100">
                <h1 className="title">Verificando su cuenta...</h1>
                <div className="spinner-border text-dark" role="status">
                </div>
            </div>

        </>
    )

}