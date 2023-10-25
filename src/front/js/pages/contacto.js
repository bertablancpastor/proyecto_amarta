import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import { Context } from "../store/appContext";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import "../../styles/home.css";

export const Contacto = () => {
	const { actions } = useContext(Context);


	const [email, setEmail] = useState("");
	const [mensaje, setMensaje] = useState("");
	const [nombre, setNombre] = useState("");
	const [apellido, setApellido] = useState("");
	const [alertMessage, setAlertMessage] = useState('');
	const [alertType, setAlertType] = useState('');
	const [alertNL, setAlertNL] = useState('');
	const [alertTypeNL, setAlertTypeNL] = useState('');

	const enviarMsg = async (nombre, apellido, email, mensaje) => {
		const msg = actions.enviarMensaje(nombre, apellido, email, mensaje)
		return msg
	}

	const enviarEmailNL = async (subscripcion) => {
		const msg = actions.enviarEmailNL(subscripcion)
		return msg
	}

	const handleAlertMensaje = (message, type) => {
		setAlertMessage(message);
		setAlertType(type);
	};

	const handleAlertNL = (message, type) => {
		setAlertNL(message);
		setAlertTypeNL(type);
	};

	//Validaciones enviar formulario contacto
	const formik = useFormik({
		initialValues: {
			nombre: '',
			apellido: '',
			email: '',
			mensaje: '',
		},
		validationSchema: Yup.object({
			nombre: Yup.string()
				.max(20, 'Debe tener máximo 20 caracteres o menos')
				.required('Campo obligatorio'),
			apellido: Yup.string()
				.max(20, 'Debe tener máximo 15 caracteres o menos')
				.required('Campo obligatorio'),
			email: Yup.string().email('Correo electronico no válido').required('Campo obligatorio'),
			mensaje: Yup.string()
				.max(500, 'Máximo 500 caracteres')
				.required('Campo obligatorio'),
		}),
		onSubmit: values => {
				enviarMsg(values.nombre, values.apellido, values.email, values.mensaje)
				if (enviarMsg) {
					handleAlertMensaje('Mensaje enviado! Te responderemos lo antes posible', 'dark');
					//Reseteando el formulario una vez enviada la información
					formik.resetForm();
				} else {
					handleAlertMensaje('Error al enviar el mensaje', 'danger')
				}
		}
	});

	//Validaciones subscribirse a la NL
	const formikNL = useFormik({
		initialValues: {
			emailNL: ''
		},
		validationSchema: Yup.object({
			emailNL: Yup.string().email('Correo electronico no válido').required('Campo obligatorio'),
		}),
		onSubmit: values => {
				enviarEmailNL(values.emailNL)
				if (enviarEmailNL) {
					handleAlertNL('Subscrito correctamente a la newsletter!', 'dark');
					//Reseteando el input del email una vez enviada la información
					formikNL.resetForm();
				} else {
					handleAlertNL('Error al enviar el mensaje', 'danger')
				}
				
		}
	});


	return (
		<div className="">
			<div className="container-fluid bg-secondary-subtle p-5 bg-white bg-opacity-50 flex-grow-1 min-vh-100">
				<div className="container-fluid row pb-5">
					<div className="col">
						<p className="title h1 pb-4">¿En qué te podemos ayudar?</p>
						<p className="fw-bold fs-4">La belleza de tu historia es que continuará evolucionando y tu sitio evolucionará con ella.</p>
						<p className="h5 pb-2">info@amarta.com</p>
						<p className="h5 ">555-555-555</p>
					</div>
					<form className="col" onSubmit={formik.handleSubmit}>
						<div className="row">
							<div className="col pb-2">
								<input className="form-control" placeholder="Escribe tu nombre" id="nombre"
									name="nombre" onChange={formik.handleChange} value={formik.values.nombre} />
								{formik.errors.nombre ? <div className="text-danger fw-bold">{formik.errors.nombre}</div> : null}
							</div>
							<div className="col">
								<input className="form-control" placeholder="Escribe tus apellidos" id="apellidos" name="apellido" onChange={formik.handleChange} value={formik.values.apellido} />
								{formik.errors.apellido ? <div className="text-danger fw-bold">{formik.errors.apellido}</div> : null}
							</div>
						</div>
						<div className="row">
							<div className="col pb-2">
								<input className="form-control" id="email" placeholder="Dejanos un correo electrónico" name="email" onChange={formik.handleChange} value={formik.values.email} />
								{formik.errors.email ? <div className="text-danger fw-bold">{formik.errors.email}</div> : null}
							</div>
						</div>
						<div className="mb-3">
							<textarea className="form-control" id="textArea" rows="3" placeholder="Te escuchamos! ¿Qué nos quieres contar?" name="mensaje" onChange={formik.handleChange} value={formik.values.mensaje} ></textarea>
							{formik.errors.mensaje ? <div className="text-danger fw-bold">{formik.errors.mensaje}</div> : null}
						</div>

						<button type="submit" className="btn btn-dark me-md-2 mb-3">Enviar</button>
						{alertMessage && (
							<div className={`alert alert-${alertType} alert-dismissible`} role="alert">
								<div>{alertMessage}</div>
								<button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
							</div>
						)}
					</form>
				</div>
				<div className="container-fluid row pt-5">
					<div className="col">
						<p className="h3 pb-4 title">¡Especialmente para ti!</p>
						<p className="fs-6 mb-0 fw-bold">Regístrate y sé la primera persona en enterarte de los descuentos!</p>
						<p className="fs-6 fw-bold">Recibe los consejos y todo lo que ofrece AMARTA.</p>
					</div>
					<form className="col "  onSubmit={formikNL.handleSubmit}>
						<input name="emailNL" className="form-control " placeholder="Correo electrónico" onChange={formikNL.handleChange} value={formikNL.values.emailNL}  />
						{formikNL.errors.emailNL ? <div className="text-danger fw-bold">{formikNL.errors.emailNL}</div> : null}
						<button type="submit" className="btn btn-dark  me-md-2 mt-3">Subscribirse</button>
					</form>
				</div>
				<div className="container-fluid row">
					<div className="col"></div>
					<div className="col">
						{alertNL && (
							<div className={`alert alert-${alertTypeNL} alert-dismissible`} role="alert">
								<div>{alertNL}</div>
								<button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

