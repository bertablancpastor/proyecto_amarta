import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { googleLogout } from '@react-oauth/google';

const urlBack = process.env.BACKEND_URL

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: null,
			message: "",
			validate: false,
			logged: false,
			productos: [],
			tipo_producto: [],
			producto: {},
			stripePublicKey: null,
			favs: [],
			user: {},
			carrito: [],
			totalCarrito: 0,
			correo_para_verificacion: "",
			pedidos: [],
			googleUser: false,
		},
		actions: {
			login: async (email, password) => {
				try {
					const data = await axios.post(`${urlBack}/api/login`, {
						email: email,
						password: password
					})
					localStorage.setItem("token", data.data.access_token)
					setStore({ token: data.data.access_token, user: data.data.user })
					await getActions().getFavs(data.data.user.id)
					await getActions().getCarrito()
					await getActions().getPedidos()
					console.log("Usuario logueado correctamente")
					return { success: true };
				} catch (error) {
					console.log(error);
					return { success: false, errorMsg: "Usuario no registrado o contraseña no válida." };
				}

			},

			googleLogIn: async (userData) => {
				try {
					const data = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${userData.access_token}`, {
						headers: {
							Authorization: `Bearer ${userData.access_token}`,
							Accept: 'application/json'
						}
					}).then((res) => setStore({ user: res.data }))
				} catch (error) {
					console.log(error);
				}
				try {
					const loggedData = await axios.post(`${urlBack}/api/gLogin`, {
						user: getStore().user
					})
					console.log(loggedData)
					localStorage.setItem("token", loggedData.data.access_token);
					setStore({ user: loggedData.data.user, logged: true })
					await getActions().getFavs()
					await getActions().getCarrito()
					await getActions().getPedidos()
					return true
				} catch (error) {
					console.log(error);
					return false
				}

				// setStore({ user: loggedData.data.user })
			},

			signup: async (nombre, apellidos, email, password) => {
				try {
					const data = await axios.post(`${urlBack}/api/signup`, {
						nombre: nombre,
						apellidos: apellidos,
						email: email,
						password: password
					})
					localStorage.setItem("token", data.data.access_token)
					setStore({ token: data.data.access_token })
					await getActions().getCarrito()
					console.log("Usuario registrado correctamente")
					return { success: true };
				} catch (error) {
					console.log(error);
					return { success: false, errorMsg: "Error al registrarse, completa todos los datos." };
				}
			},

			private: async () => {
				try {
					const getToken = {
						headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
					}
					let data = await axios.get(`${urlBack}/api/private`, getToken)
					return true
				} catch (error) {
					console.log(error);
					return false
				}
			},

			validToken: async () => {
				let token = localStorage.getItem("token")

				try {
					//codigo exitoso
					let data = await axios.get(`${urlBack}/api/private`, {
						headers: {
							"Authorization": `Bearer ${token}`,
						}
					})
					console.log(data);
					if (data.status === 200) {
						await setStore({ user: data.data, logged: true })
						await getActions().getCarrito()
						await getActions().getFavs()
						return true;
					}
				} catch (error) {
					console.log(error);
					if (error.response.status === 401) {
						setStore({ message: { type: "danger", display: "block", msg: "La sesión ha expirado" } })
						localStorage.removeItem("token")
						return false
					}
					else if (error.response.status === 422) {
						setStore({ message: { type: "danger", display: "block", msg: "No se ha iniciado sesión aun" } })
						return false
					}
					return false
				}
			},

			getProducts: async () => {
				try {
					let data = await axios.get(`${urlBack}/api/catalogo`)
					setStore({ productos: data.data });

				} catch (error) {
					// console.log(error);
				}

			},

			getTipoProducto: async () => {
				try {
					let data = await axios.get(`${urlBack}/api/tipo_producto`)
					setStore({ tipo_producto: data.data });

				} catch (error) {
					console.log(error);
				}

			},

			getOneProduct: async (id_producto) => {
				try {
					let data = await axios.get(`${urlBack}/api/producto/${id_producto}`)
					setStore({ producto: data.data.data });
					return true

				} catch (error) {
					console.log(error);
					return false
				}

			},
			getCarrito: async () => {
				if (getStore().logged) {
					try {
						let data = await axios.get(`${urlBack}/api/carrito/${getStore().user.id}`)
						setStore({ carrito: data.data.carrito })
						setStore({ totalCarrito: data.data.total })
						return true
					} catch (error) {
						console.log(error);
						return false
					}
				}
				let dataCarrito = JSON.parse(localStorage.getItem("carritoLocal"))
				setStore({ carrito: dataCarrito["data"], totalCarrito: dataCarrito["total"] })
			},

			agregarAlCarrito: async (prod, cantidad) => {
				if (getStore().logged) {
					try {
						await axios.post(`${urlBack}/api/carrito/${getStore().user.id}`, {
							producto: prod.id_producto,
							cantidad: cantidad
						});
						await getActions().getCarrito()
						return true
					} catch (error) {
						console.log(error);
						return false
					}
				}
				let dataCarrito = JSON.parse(localStorage.getItem("carritoLocal"))
				let carrito = dataCarrito["data"]
				let total = parseInt(dataCarrito["total"])
				let encontrado = false
				console.log(dataCarrito, carrito, total);
				console.log(prod);
				for (let index in carrito) {
					console.log(carrito[index]);
					if (prod.id_producto === carrito[index].id_producto) {
						total = total - prod.precio * prod.cantidad
						carrito[index].cantidad += cantidad
						carrito[index].total = carrito[index].precio * carrito[index].cantidad
						total += carrito[index].total
						encontrado = true
						break
					}
				}
				if (!encontrado) {
					prod.cantidad = cantidad
					prod.total = prod.precio * prod.cantidad
					carrito.push(prod)
					console.log(prod);
					total += prod.total
				}

				setStore({ carrito: carrito, totalCarrito: total })
				localStorage.setItem("carritoLocal", JSON.stringify({ "data": carrito, "total": total }))


			},
			eliminarDelCarrito: async (prod) => {
				console.log(prod);
				if (getStore().logged) {
					try {
						await axios.delete(`${urlBack}/api/carrito/${getStore().user.id}/${prod.id_producto}`);
						await getActions().getCarrito()
						return true
					} catch (error) {
						console.log(error);
						return false
					}
				}
				let dataCarrito = JSON.parse(localStorage.getItem("carritoLocal"))
				let carrito = dataCarrito["data"]
				let total = dataCarrito["total"]
				for (let index in carrito) {
					if (prod.id_producto === carrito[index].id_producto) {
						total = total - prod.cantidad * prod.precio
						carrito.splice(index, 1)
						break
					}
				}
				setStore({ carrito: carrito, totalCarrito: total })
				localStorage.setItem("carritoLocal", JSON.stringify({ "data": carrito, "total": total }))

			},
			actualizarCarrito: async (prod, cantidad) => {
				if (getStore().logged) {
					try {
						const data = await axios.put(`${urlBack}/api/carrito/${getStore().user.id}/${prod.id_producto}`, {
							cantidad: cantidad
						});
						console.log(data);
						await getActions().getCarrito()
						return true
					} catch (error) {
						console.log(error);
						return false
					}
				}
				let dataCarrito = JSON.parse(localStorage.getItem("carritoLocal"))
				let carrito = dataCarrito["data"]
				let total = dataCarrito["total"]
				for (let index in carrito) {
					if (prod.id_producto === carrito[index].id_producto) {
						total -= carrito[index].total
						carrito[index].cantidad = cantidad
						carrito[index].total = prod.precio * cantidad
						total += carrito[index].total
						break
					}
				}
				setStore({ carrito: carrito, totalCarrito: total })
				localStorage.setItem("carritoLocal", JSON.stringify({ "data": carrito, "total": total }))
			},
			getContrasenya: async (email) => {
				try {
					let data = await axios.post(`${urlBack}/api/forgotpassword`, {
						email: email,
					})
					setStore({ correo_para_verificacion: data.data })

					return { success: true, Msg: "Su nueva clave ha sido enviada al correo electrónico ingresado" };
				} catch (error) {
					console.log(error);
					return { success: false, errorMsg: "Error al cargar el correo." };

				}
			},


			enviarMensaje: async (nombre, apellido, email, mensaje) => {
				try {
					let data = await axios.post(`${urlBack}/api/enviarmensaje`, {
						email: email,
						nombre: nombre,
						apellido: apellido,
						mensaje: mensaje
					})
					console.log(data);
					return true
				} catch (error) {
					console.log(error);
					return false
				}

			},

			enviarEmailNL: async (email) => {
				try {
					let data = await axios.post(`${urlBack}/api/inscribirseNL`, {
						email: email,
					})
					console.log(data);
					return true
				} catch (error) {
					console.log(error);
					return false
				}
			},


			// Use getActions to call a function within a fuction
			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},

			getFavs: async () => {
				try {
					const data = await axios.get(`${urlBack}/api/favoritos/${getStore().user.id}`)
					setStore({ favs: data.data.favoritos });
				} catch (error) {

				}
			},
			toggleFav: async (prod_id) => {
				try {
					const data = await axios.post(`${urlBack}/api/favoritos/${getStore().user.id}/${prod_id}`)
					await getActions().getFavs(getStore().user.id)
				} catch (error) {
					console.log(error);
				}
			},

			prodIsFaved: (id_prod) => {
				let favs = getStore().favs
				for (let index = 0; index < parseInt(favs["length"]); index++) {
					if (id_prod === favs[index]["id_producto"]) {
						return true
					}
				} return false
			},
			logOut: () => {
				setStore({ logged: false, token: null, carrito: [], favoritos: [] })
				localStorage.removeItem("token")
				localStorage.removeItem("dataCompra")
				if (getStore().googleUser) {
					googleLogout()
				}
			},
			getStripePublicKey: async () => {
				try {
					const data = await axios.get(`${urlBack}/config`)
					setStore({ stripePublicKey: data.data.publicKey });
					return true
				} catch (error) {
					console.log(error);
					return false
				}
			},
			processPayment: async () => {
				if (getStore().logged) {
					const cart = getStore().carrito
					// localStorage.setItem('id', getStore().user.id)
					localStorage.setItem("dataCompra", JSON.stringify({ "id": getStore().user.id, "carrito": cart }))
					const stripe = await loadStripe(getStore().stripePublicKey)
					try {
						const data = await axios.post(`${urlBack}/payment`, {
							carrito: cart
						})
						stripe.redirectToCheckout({ sessionId: data.data.sessionId });
					} catch (error) {
						console.log(error);
					}
				}
				const stripe = await loadStripe(getStore().stripePublicKey)
				try {
					const data = await axios.post(`${urlBack}/payment`, {
						carrito: getStore().carrito
					})
					stripe.redirectToCheckout({ sessionId: data.data.sessionId });
				} catch (error) {
					console.log(error);
				}
			},
			getPedidos: async () => {
				try {
					const data = await axios.get(`${urlBack}/api/pedido/${getStore().user.id}`)
					await setStore({ pedidos: data.data.pedidos });
					console.log(getStore().pedidos);
					return true
				} catch (error) {
					console.log(error);
				}
			},
			crearPedido: async () => {
				console.log(getStore().logged);
				if (localStorage.getItem("dataCompra") !== null) {
					try {
						const dataCompra = JSON.parse(localStorage.getItem("dataCompra"))
						console.log(dataCompra);
						const data = await axios.post(`${urlBack}/api/pedido/${dataCompra.id}`, {
							carrito: dataCompra["carrito"]
						})
						console.log(carrito);
						console.log(data);
						setStore({ carrito: [] })
						localStorage.removeItem("dataCompra")
						return true
					} catch (error) {
						console.log(error);
						return false
					}
				}
				let dataCarrito = JSON.parse(localStorage.getItem("carritoLocal"))
				console.log(dataCarrito);
				try {
					const data = await axios.post(`${urlBack}/api/pedido/${localStorage.getItem("localEmail")}`, {
						carrito: dataCarrito["data"]
					})
					console.log(data);
					setStore({ carrito: [] })
					localStorage.removeItem("localEmail")
					localStorage.setItem("localPayment", false)
					localStorage.setItem("carritoLocal", JSON.stringify({ "data": [], "total": 0 }))
					return true
				} catch (error) {
					console.log(error);
					return false
				}
			},

			actualizarDatos: async (direccion, ciudad, codigo_postal) => {
				console.log(direccion, ciudad, codigo_postal);
				console.log("Activo");
				try {
					const data = await axios.put(`${urlBack}/api/private`, {
						id: getStore().user.id,
						direccion: direccion === undefined ? null : direccion,
						ciudad: ciudad === undefined ? null : ciudad,
						codigo_postal: codigo_postal === undefined ? null : codigo_postal
					})
				} catch (error) {
					console.log(error);
				}
			},
		}
	};
}
export default getState;
