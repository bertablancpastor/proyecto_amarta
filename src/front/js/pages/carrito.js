import React, { useState, useEffect, useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { ProductoCarrito } from "../component/productoCarrito";
import { Modal, ModalHeader, ModalTitle, ModalBody, ModalDialog, ModalFooter } from "react-bootstrap";


export const Carrito = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate()
    const [show, setShow] = useState("")
    const [email, setEmail] = useState()

    function handlePayment() {
        if (store.logged && store.totalCarrito !== 0) { actions.processPayment() }
        else if (!store.logged && store.totalCarrito !== 0) {
            setShow("show")
        }
        else { alert("El carrito está vacío") }
    }

    function handleHide() {
        setShow("")
    }
    function finalizePayment() {
        localStorage.setItem("localPayment", true)
        localStorage.setItem("localEmail", email)
        actions.processPayment()
    }

    useEffect(() => {
        async function setUpStripe() {
            await actions.getStripePublicKey()
        }
        setUpStripe()
    }, [])
    useEffect(() => {
    }, [])

    return (
        <div className=" min-vh-100 bg-white" >
            <div className="">
                <div className="topBar">
                    <div className="prodDiv">
                        <p>PRODUCTO</p>
                    </div>
                    <div className="detailsDiv">

                        <div className="d-flex text-center align-items-center w-25">
                            <p className="w-100 m-0">PRECIO</p>
                        </div>
                        <div className="qtyDiv w-25">
                            <p className="m-0">UNIDADES</p>
                        </div>
                        <div className="w-25 h-100 d-flex align-items-center text-center">
                            <p className="w-100 m-0">TOTAL</p>
                        </div>
                    </div>
                </div>
                {store.carrito.length === 0 ? (
                    <div className="p-2 bg-white bg-opacity-50 emptyCarritoMsg text-center my-5">
                        <h5 className="text-center">El carrito está vacío</h5>
                    </div>
                ) : (
                    <div>
                        {store.carrito.map((item) => (<ProductoCarrito key={item.id_producto} item={item}></ProductoCarrito>))}
                    </div>
                )}
            </div>
            <div className="d-flex justify-content-end my-5 me-5 pt-4">
                <div className="checkOutDiv  align-content-center">
                    <div className="checkOutField mb-3">
                        <p>SUBTOTAL</p>
                        <p>{store.totalCarrito - (store.totalCarrito * 0.21)} €</p>
                    </div>
                    <div className="checkOutField mb-3 border-bottom">
                        <p>IVA</p>
                        <p>{store.totalCarrito * 0.21} €</p>
                    </div>
                    <div className="checkOutField mb-3">
                        <h5>TOTAL</h5>
                        <p>{store.totalCarrito},00 €</p>
                    </div>
                    <button className="btn btn-dark" onClick={handlePayment}>Finalizar Compra</button>
                </div>
            </div>

            <Modal className="text-center" show={show} onHide={handleHide}>
                <ModalHeader className="bg-light" closeButton>
                    <ModalTitle>Introduce un correo</ModalTitle>
                </ModalHeader>
                <ModalBody className="bg-light">
                    <ModalDialog>Para poder finalizar tu compra, necesitamos un email para enviarte los detalles de tu pedido.</ModalDialog>
                    <label className="me-3" htmlFor="#email">Email</label>
                    <input id="email" placeholder="Email" onChange={e => { setEmail(e.target.value) }} />
                </ModalBody>
                <ModalFooter className="bg-light flex justify-content-center">
                    <button onClick={finalizePayment} className="btn text-white bg-dark">Finalizar Pago</button>
                </ModalFooter>
            </Modal>
        </div>
    );
}