"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint, current_app
from api.models import db, User, Producto, Tipo_prod, Favorito, Pedido, Carrito,PedidoLocal
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
#importamos Message() de flask_mail
from flask_mail import Message 
#importamos ramdom y string para generar una clave aleatoria nueva
import random
import string
from datetime import datetime
import uuid


api= Blueprint('api', __name__)

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200



    
@api.route("/signup", methods=["POST"])
def signup():  
    request_body = request.get_json(force=True)
    email = request.json.get("email", None)
    
    #creacion de un registro en la tabla de user 
    if "nombre" not in request_body:
        return jsonify({"msg": "You have to put your name"}), 404
    
    if "apellidos" not in request_body:
        return jsonify({"msg": "You have to put your surnames"}), 404
    
    if "email" not in request_body:
        return jsonify({"msg": "You have to put an email"}), 404
    
    email_query = User.query.filter_by(email=request_body["email"]).first()
    
    if email_query != None:
        return jsonify({"msg": "User already exists"}), 400
        
    if "password" not in request_body:
        return jsonify({"msg": "You have to put a password"}), 404
    
    user = User(email=request_body["email"],password=request_body["password"],nombre=request_body["nombre"],apellido=request_body["apellidos"])

    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token)

@api.route("/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    
    user = User.query.filter_by(email=email).first()
    
    if user is None:
        return jsonify({"msg": "User doesn't exist"}), 404
    
    if email != user.email or password != user.password:
        return jsonify({"msg": "Bad username or password"}), 401
    
    access_token = create_access_token(identity=email)
    response = jsonify({"access_token":access_token, "user": user.serialize() })
    
    response.headers.add('Access-Control-Allow-Origin', '*')

    return response, 200

@api.route("/private", methods=["GET"])
@jwt_required()
def get_profile():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    
    return jsonify(user.serialize()), 200

@api.route("/private", methods=["PUT"])
def update_profile():
    request_body = request.get_json(force = True)
    print(request_body)
    user = User.query.filter_by(id = request_body["id"]).first()
    print(user)
    if request_body["direccion"] != None: 
        user.direccion = request_body["direccion"]
    if request_body["ciudad"] != None:
        user.ciudad = request_body["ciudad"]
    if request_body["codigo_postal"] != None:
        user.codigo_postal = request_body["codigo_postal"]
    
    db.session.commit()

    return jsonify(user.serialize()), 200

@api.route("/catalogo", methods=["GET"])
def get_products():
    productos = Producto.query.all()
    data = [producto.serialize() for producto in productos]
    return jsonify(data), 200

@api.route("/tipo_producto", methods=["GET"])
def get_tipo_producto():
    tipo_producto = Tipo_prod.query.all()
    data = [tipo.serialize() for tipo in tipo_producto]
    return jsonify(data), 200

@api.route("/producto/<int:id_producto>", methods=["GET"])
def get_une_product(id_producto):
    producto = Producto.query.filter_by(id = id_producto).first()
    # print(producto.serialize())
    response_body = {
        "msg": "ok",
        "data": producto.serialize()
    }

    return jsonify(response_body), 200




@api.route("/favoritos/<int:user_id>/<int:prod_id>",methods = ["POST"])
def add_favorite(user_id,prod_id):
    fav = Favorito.query.filter_by(id_user=user_id,id_prod=prod_id).first()
    if fav is None:
        new_fav = Favorito(id_user = user_id,id_prod = prod_id)
        db.session.add(new_fav)
        db.session.commit()
        return jsonify({"msg":"ok - new favorite"}),200
    elif fav is not None:
        db.session.delete(fav)
        db.session.commit()
        return jsonify({"msg":"ok - favorite deleted"}),200

@api.route("/favoritos/<int:user_id>",methods = ["GET"])
def get_favorites(user_id):
    favs = Producto.query.join(Favorito).filter(Favorito.id_user == user_id).all()
    data = [fav.serialize() for fav in favs]
    response_body = jsonify({
        "msg":"ok - all favs",
        "favoritos" : data
    })
    response_body.headers.add('Access-Control-Allow-Origin', '*')
    return response_body,200

@api.route('/carrito/<int:user_id>', methods=['GET'])
def get_carrito(user_id):
    carrito = db.session.query(Carrito.cantidad,Producto.id,Producto.nombre,Producto.precio,Producto.url_img,Producto.id_precio).join(Producto).filter(Carrito.id_user==user_id).all()
    data = []
    total = 0
    for item in carrito:
        producto = {
            "id_producto":item[1],
            "nombre":item[2],
            "precio":item[3],
            "id_precio":item[5],
            "cantidad":item[0],
            "url_img":item[4],
            "total":int(item[3])*int(item[0])
        }
        total += producto['total']
        data.append(producto)
    response_body = jsonify({
        "msg": "ok - carrito",
        "carrito" : data,
        "total":total
    })
    return response_body, 200

@api.route('/carrito/<int:user_id>', methods=['POST'])
def add_to_carrito(user_id):
    request_body = request.get_json(force=True)
    inCarrito = Carrito.query.filter_by(id_user=user_id,id_prod=request_body["producto"]).first()
    print(inCarrito)
    if inCarrito is None:
        newCarritoItem = Carrito(id_user = user_id,id_prod=request_body["producto"],cantidad=request_body["cantidad"])
        db.session.add(newCarritoItem)
        db.session.commit()
        return jsonify({"msg": "ok - Added To carrito"}),200
    elif inCarrito is not None:
        inCarrito.cantidad += int(request_body["cantidad"])
        db.session.commit()
        return jsonify({"msg":"ok - Carrito updated",
                        "cantidad":inCarrito.cantidad})
    
    return jsonify({"msg":"Error desconocido"}),200

@api.route('/carrito/<int:user_id>',methods=['DELETE'])
def delete_carrito(user_id):
    carrito = Carrito.query.filter_by(id_user=user_id).all()
    if carrito is None:
        return jsonify({"msg":"Carrito no existe"}),200
    for item in carrito:
        db.session.delete(item)
    db.session.commit()
    return jsonify({"msg":"ok - Carrito eliminado"})

@api.route('/carrito/<int:user_id>/<int:prod_id>', methods=['DELETE'])
def delete_from_carrito(user_id,prod_id):
    item = Carrito.query.filter_by(id_user=user_id,id_prod=prod_id).first()
    if item is None:
        return jsonify({"msg":"No econtrado en el carrito"}),200
    else:
        db.session.delete(item)
        db.session.commit()
        return jsonify({"msg":"ok - Eliminado del carrito"}),200
    
@api.route('/carrito/<int:user_id>/<int:prod_id>', methods=['PUT'])
def update_from_carrito(user_id,prod_id):
    request_body = request.get_json(force=True)
    item = Carrito.query.filter_by(id_user=user_id,id_prod=prod_id).first()
    if item is None:
        return jsonify({"msg":"No ha encontrado en el carrito"}),200
    else:
        item.cantidad = request_body["cantidad"]
        db.session.commit()
        return jsonify({"msg":"ok - Carrito actualizado","cantidad":request_body["cantidad"]}),200

#RECUPERACION CONTRASEÑA OLVIDADA 
@api.route("/forgotpassword", methods=["POST"])
def forgotpassword():
    recover_email = request.get_json(force=True)['email']
    recover_password = ''.join(random.choice(string.ascii_uppercase + string.digits) for x in range(8)) #clave aleatoria nueva
    
    if recover_email is None:
        return jsonify({"msg": "Debe ingresar el correo"}), 401
	#busco si el correo existe en mi base de datos
    user = User.query.filter_by(email=recover_email).first()
    if user is None:
        return jsonify({"msg": "El correo no se encuentra registrado"}), 200
    #si existe guardo la nueva contraseña aleatoria
    user.password = recover_password
    db.session.commit()
	#luego se la envio al usuario por correo para que pueda ingresar
    msg = Message("Hi", recipients=[recover_email])
    msg.html = f"""<h1>Su nueva contraseña es: {recover_password}</h1>"""
    current_app.mail.send(msg)
    return jsonify({"msg": "La contraseña ha sido enviada"}), 200

#ENVIAR MENSAJE A TIENDA
@api.route("/enviarmensaje", methods=["POST"])
def enviarmensaje():
    data = request.json
    msg = Message("Nuevo mensaje", recipients=["info@amarta.com"])
    msg.html = f"""<h1>Contacto de: {data["nombre"]} {data["apellido"]} {data["email"]}</h1> <p>Mensaje: {data["mensaje"]}</p>"""
    current_app.mail.send(msg)
    return jsonify({"msg": "Mensaje enviado correctamente"}), 200


#INSCRIBIRSE A NL
@api.route("/inscribirseNL", methods=["POST"])
def inscribirsenewsletter():
    data = request.json
    msg = Message("Nuevo alta de email", recipients=["info@amarta.com"])
    msg.html = f"""<h1>Nueva alta de email: {data["email"]}</h1>"""
    current_app.mail.send(msg)
    return jsonify({"msg": "Inscrito correctamente"}), 200

@api.route("/pedido/<int:user_id>",methods = ['POST'])
def crear_pedido(user_id):
    print("holi")
    fecha = datetime.now()
    id_pedido = uuid.uuid4()
    request_body = request.get_json(force=True)
    print(request_body)
    for item in request_body["carrito"]:
        pedido = Pedido(id = id_pedido,id_user = user_id,id_prod = item['id'],fecha=fecha,cantidad = item['cantidad'])
        print(pedido)
        db.session.add(pedido)
    prevCarrito = Carrito.query.filter_by(id_user=user_id).all()
    if prevCarrito is None:
        print('Carrito esta vacio')
    else:
        for item in prevCarrito:
            db.session.delete(item)
    db.session.commit()
    return jsonify({"msg":"ok - Pedido creado & Carrito eliminado"})

@api.route("/pedido/<email>",methods = ['POST'])
def crear_pedido_local(email):
    print("holi")
    fecha = datetime.now()
    id_pedido = uuid.uuid4()
    request_body = request.get_json(force=True)
    print(request_body)
    for item in request_body["carrito"]:
        pedido = PedidoLocal(id = id_pedido,email = email,id_prod = item['id_producto'],fecha=fecha,cantidad = item['cantidad'])
        print(pedido)
        db.session.add(pedido)
    db.session.commit()
    return jsonify({"msg":"ok - Pedido creado & Carrito eliminado"})

@api.route("/pedido/<int:user_id>",methods = ['GET'])
def get_pedidos(user_id):
    pedidos = db.session.query(Pedido.id,Producto.id,Producto.nombre,Producto.precio,Producto.url_img,Pedido.cantidad,Pedido.fecha).join(Producto).filter(Pedido.id_user==user_id).all()
    if pedidos is None:
        return jsonify({"msg":"No hay pedidos"}),200
    data = []
    for ped in pedidos:
        item={
            "id_pedido":ped[0],
            "id_prod":ped[1],
            "nombre":ped[2],
            "precio":ped[3],
            "img":ped[4],
            "cantidad":ped[5],
            "fecha":ped[6]
        }
        data.append(item)
    print(data)
    response_body = {
        "msg":"ok - pedidos",
        "pedidos":data
    }
    return jsonify(response_body),200