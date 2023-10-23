import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
// import { LoginyRegistro } from "./login&register";
import { Carrito } from "../pages/carrito";
import { Contacto } from "../pages/contacto";
import { Catalogo } from "../pages/catalogo";
import amartaLogoNegro from "../../img/logoAMARTAblanco.png";
import { Modal } from "react-bootstrap";
import "../../styles/navbar.css"
import Swal from 'sweetalert2'
import { useGoogleLogin } from "@react-oauth/google";

export const Navbar = () => {
  const { store, actions } = useContext(Context);

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [mostrarLoginyRegistro, setMostrarLoginyRegistro] = useState(false);
  const [mostrarContacto, setMostrarContacto] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const Swal = require('sweetalert2')

  const setGoogleLogin =
    useGoogleLogin({
      onSuccess: (codeResponse) => {
        actions.googleLogIn(codeResponse)
        setMostrarLoginyRegistro(false)
        navigate('/private')
      },
      onError: (error) => console.log('Login Failed:', error)
    })
    ;



  const handleMostrarLoginyRegistro = () => {
    setMostrarLoginyRegistro(true);
  };


  async function handleSubmitSignup(e) {
    e.preventDefault();
    console.log(email, password);

    let response = await actions.signup(name, apellidos, email, password);

    if (response.success) {
      setMostrarLoginyRegistro(false);
      navigate('/private');
    } else {
      setAlertMessage(response.errorMsg);
      setAlertType("danger");
    }
  }

  async function handleSubmitLogin(e) {
    e.preventDefault();
    console.log(email, password);

    let response = await actions.login(email, password);

    if (response.success) {
      setMostrarLoginyRegistro(false);
      navigate("/private");
    } else {
      setAlertMessage(response.errorMsg);
      setAlertType("danger");
    }
  }

  async function handleRecuperar(e) {
    e.preventDefault();
    try {
      await actions.getContrasenya(email)
      Swal.fire('Revisa tu correo con la nueva contraseña')
      const comprobacion = store.correo_para_verificacion;
      if (comprobacion.msg === 'La contraseña ha sido enviada') {
        Swal.fire({
          text: 'Revisa tu correo con la nueva contraseña',
          customClass: {
            confirmButton: 'btn bg-dark btn-secondary',
          },
          buttonsStyling: false,
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'El correo no se encuentra registrado',
          text: 'Vuelve a intentarlo o regístrate.',
          customClass: {
            confirmButton: 'btn bg-dark btn-secondary',
          },
          buttonsStyling: false,
        })
      }
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Ha ocurrido un error. Por favor, intenta de nuevo.',
        customClass: {
          confirmButton: 'btn bg-dark btn-secondary',
        },
        buttonsStyling: false,
      });
    }
    useEffect(() => {
      if (mostrarLoginyRegistro) {
        setAlertMessage("");
        setAlertType("");
      }
    }, [mostrarLoginyRegistro]);
  }


  useEffect(() => {
    if (mostrarLoginyRegistro) {
      setAlertMessage("");
      setAlertType("");
    }
  }, [mostrarLoginyRegistro]);


  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary  border-bottom border-3 sticky-top color-navbar">
      <div className="container-fluid  m-6">
        <button className="navbar-toggler text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <i className="fa-solid fa-bars"></i>
        </button>
        <Link className="nav-item logoAmartaNav" to={"/catalogo"}>
          <img src={amartaLogoNegro} alt="AMARTA" width="175" height="35"></img>
        </Link>

        <div className="collapse navbar-collapse  text-dark menu-burguer" id="navbarNavAltMarkup">
          <ul className="navbar-nav container-fluid justify-content-around ">
            <li >
              <Link to={"/catalogo"} type="button" className=" seleccionado bg-transparent rounded nav-item fw-bold" id="catalogo">Catálogo</Link>
            </li>
            <li className="nav-item ">
              <Link to={"/contacto"} type="button" className="seleccionado bg-transparent rounded nav-item text-white fw-bold font ">Contacto</Link>
            </li>

            <Link className="nav-item logoAmarta" to={"/catalogo"}>
              <img src={amartaLogoNegro} alt="AMARTA" width="175" height="35"></img>
            </Link>

            <li className="nav-item font">
              {store.logged ? <div className="dropdown dropdown-center ">
                <a className="text-media text-white dropdown-toggle fw-bold active border-0 " href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Cuenta
                </a>
                <ul className="dropdown-menu list-unstyled dropdown-menu-start">
                  <li><Link className="btn dropdown-item text-black" to={"/private"}><i className="d-flex float-start  align-items-end fa-solid fa-user pt-1 mb-1"></i><p className="d-flex ps-3 mt-0 mb-1 ">Perfil</p></Link></li>
                  <li><button className="btn dropdown-item text-black" onClick={() => {
                    actions.logOut()
                    navigate("/")
                  }}><i className="d-flex float-start align-items-end fa-solid fa-arrow-right-from-bracket pt-1 ms-3"></i><p className="d-flex ps-3 mt-0 mb-1 ">Cerrar sesión</p></button></li>
                </ul>
              </div>
                : <button
                  type="button"
                  className="seleccionado text-white fw-bold border-0 bg-transparent "
                  data-bs-toggle="modal"
                  onClick={handleMostrarLoginyRegistro}>
                  Cuenta
                </button>
              }
            </li>
            <li className="nav-item font">
              <button
                type="button"
                className="seleccionado text-white fw-bold  border-0 bg-transparent  "
                onClick={(e) => navigate("/carrito")}>
                Carrito ({store.carrito?.length === 0 ? "0" : store.carrito.length})
              </button>

            </li>
            {/*<span className=""></span> */}
          </ul>
        </div>
      </div>
      {mostrarContacto && <Contacto />}

      {/* MODAL LOGIN Y REGISTRO */}
      <Modal show={mostrarLoginyRegistro} tabIndex="-1" data-bs-target="exampleModal" id="exampleModal">
        <nav className="modal-dialog">
          <div className="modal-content fondoModal">
            <nav>
              <div
                className="modal-header nav nav-tabs justify-content-between border-0"
                id="nav-tab"
                role="tablist"
              >
                <button
                  type="button"
                  className="nav-link justify-content-center border-0 ms-5 me-5 bg-transparent text-white"
                  id="nav-iniciarID-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-inicioSesion"
                  role="tab"
                  aria-selected="true"

                >
                  Iniciar sesión
                </button>
                <button
                  type="button"
                  className="text-white nav-link justify-content-center border-0 ms-5 bg-transparent"
                  id="nav-crearID-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-crearCuenta"
                  role="tab"
                  aria-selected="false"
                >
                  Registrarse
                </button>


                <button
                  type="button" class="btn-close btn-close-white" aria-label="Close"
                  onClick={() => { setMostrarLoginyRegistro(false) }}
                ></button>


              </div>
            </nav>
            <div className="modal-body tab-content" id="nav-tabContent">
              {/* SECCION INICIO SESIÓN */}

              <form
                onSubmit={(e) => handleSubmitLogin(e)}
                className="tab-pane fade show active container"
                id="nav-inicioSesion"
                role="tabpanel"
                aria-labelledby="nav-iniciarID-tab"
              >
                <div className="form-group pb-2">
                  {/* <label className="fw-bold text-white">Email</label> */}
                  <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    placeholder="Ingresa tu correo"
                    required
                  />
                </div>
                <div className="form-group">
                  {/* <label className="fw-bold text-white">Contraseña</label> */}
                  <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                </div>
                <button className="btn btn-dark mt-2 me-2">

                  Iniciar sesión
                </button>

                <button
                  className="btn btn-dark mt-2"
                  onClick={e => handleRecuperar(e)}
                >
                  Recuperar contraseña
                </button>
              </form>

              {/* SECCION CREAR NUEVA CUENTA */}
              <form
                onSubmit={(e) => handleSubmitSignup(e)}
                // data-bs-dismiss="modal"
                className="tab-pane fade container"
                id="nav-crearCuenta"
                role="tabpanel"
                aria-labelledby="nav-crearID-tab"
              >
                <div className="form-group pb-2">
                  {/* <label className="fw-bold">Nombre</label> */}
                  <input
                    type="string"
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                    placeholder="Ingresa tu nombre"
                    required
                  />
                </div>
                <div className="form-group pb-2">
                  {/* <label className="fw-bold">Apellidos</label> */}
                  <input
                    type="string"
                    onChange={(e) => setApellidos(e.target.value)}
                    className="form-control"
                    placeholder="Ingresa tus apellidos"
                    required
                  />
                </div>
                <div className="form-group pb-2">
                  {/* <label className="fw-bold">Email</label> */}
                  <input
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    placeholder="Ingresa tu correo"
                    required
                  />
                </div>
                <div className="form-group">
                  {/* <label className="fw-bold">Contraseña</label> */}
                  <input
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-dark mt-2">Crear cuenta</button>
              </form>
              <div className=" d-flex  justify-content-center mt-3">
                <button className="btn bg-white align-content-center" onClick={setGoogleLogin}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-google pb-1 me-3" viewBox="0 0 16 16">
                  <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
                </svg>Sign in with Google</button>
              </div>
            </div>

          </div>
          <div className={`alert alert-${alertType} mt-3`} role="alert">
            {alertMessage}
          </div>

        </nav>
      </Modal>

    </nav>

  );
};
