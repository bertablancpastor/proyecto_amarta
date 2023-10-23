import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { ProductoCatalogo } from "../component/productoCatalogo";
import "../../styles/catalogo.css";

export const Catalogo = () => {
  const { store, actions } = useContext(Context);

  const [filter, setFilter] = useState("");
  const [busquedaProducto, setBusquedaProducto] = useState("");

  useEffect(() => {
    actions.getTipoProducto();
    actions.getProducts();
  }, []);

  const handleFilterChange = (idTipo) => {
    setFilter(idTipo);
  };

  return (
    <div className="min-vh-100">
      <div className="container-fluid bg-secondary-subtle p-5 bg-white bg-opacity-75 text-center">
        <h4 className="title-catalogo pb-2 d-flex justify-content-center">
          Belleza simplificada
        </h4>
        <h4 className="title-catalogo pb-2 d-flex justify-content-center">
          Solo con el mejor producto natural en cada categoría de belleza
        </h4>
        <h4 className="title-catalogo pb-2 d-flex justify-content-center">
          Todo lo que necesitas
        </h4>
        {/* <div className="d-flex justify-content-center h-25"> */}
          <ul className=" list-group list-group-horizontal justify-content-center p-0 ">
            
            <li
              className={`list-group-item d-inline-flex text-white ${filter === "" ? "active border-0" : ""}`}
              onClick={() => handleFilterChange("")}
            >
              Todos
            </li>
            {store.tipo_producto?.map((item) => (
              <li
                className={`list-group-item  d-inline-flex text-white ${filter === item.id_tipo ? "active border-0" : ""}`}
                key={item.id_tipo}
                onClick={() => handleFilterChange(item.id_tipo)}
              >
                {item.nombre}
              </li>
            ))}
             </ul>
          
  <form className="rounded d-flex h-25 list-group-item bg-black text-white search-li d-inline-flex justify-content-center  mt-2" role="search">
    <input
      className="form-control me-2 w-auto"
      type="search"
      placeholder="Busca tu producto"
      aria-label="Search"
      value={busquedaProducto}
      onChange={(e) => setBusquedaProducto(e.target.value)}
    ></input>
    <button
      className="btn btn-outline-light  border-0"
      type="submit"
    >
      <i className="fa-solid fa-magnifying-glass"></i>
    </button>
  </form>

         



        {/* </div> */}
      </div>

      <div className="row justify-content-center">
        {store.productos
          .filter((item) => filter === "" || item.id_tipo === filter) 
          .filter((item) =>
            busquedaProducto === "" || 
            item.nombre.toLowerCase().includes(busquedaProducto.toLowerCase())
          )
          .map((item) => (
            <ProductoCatalogo key={item.id_producto} producto={item} />
          ))}
      </div>
    </div>
  );
};