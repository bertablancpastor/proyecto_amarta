from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import UUID
import uuid

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    nombre = db.Column(db.String)
    apellido = db.Column(db.String)
    favoritos = db.relationship('Favorito',backref = 'user',lazy=True)
    carrito = db.relationship('Carrito',backref = 'carrito',lazy=True)
    pedidos = db.relationship('Pedido',backref = 'user',lazy=True)
    direccion = db.Column(db.String)
    ciudad = db.Column(db.String)
    codigo_postal = db.Column(db.String)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "nombre":self.nombre,
            "apellido":self.apellido,
            "direccion":self.direccion,
            "ciudad":self.ciudad,
            "codigo_postal":self.codigo_postal
            # do not serialize the password, its a security breach
        }

class Producto(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100))
    descripcion = db.Column(db.String(250))
    propiedades = db.Column(db.String(250))
    ingredientes_tec = db.Column(db.String(250))
    ingredientes_prin = db.Column(db.String(250))
    metodo_utilizacion = db.Column(db.String(250))
    tamanyo = db.Column(db.Integer)
    medicion = db.Column(db.String(5))
    precio = db.Column(db.Integer)
    id_precio = db.Column(db.String)
    id_tipo = db.Column(db.Integer,db.ForeignKey('tipo_prod.id'))
    url_img = db.Column(db.String)
    favorecidos = db.relationship('Favorito',backref = 'producto',lazy=True)
    carritos = db.relationship('Carrito',backref = 'producto',lazy=True)
    pedidos = db.relationship('Pedido',backref = 'producto',lazy=True)
    pedidosLocales = db.relationship('PedidoLocal',backref = 'producto',lazy=True)

    def __repr__(self):
        return f'<producto: {self.nombre}>'
    
    def serialize(self):
        return{
            "id_producto": self.id,
            "nombre":self.nombre,
            "descripcion":self.descripcion,
            "propiedes":self.propiedades,
            "ingredientes_tecnicos":self.ingredientes_tec,
            "ingredientes_principales":self.ingredientes_prin,
            "metodo_utilizacion":self.metodo_utilizacion,
            "tamaño":str(self.tamanyo) + self.medicion,
            "precio":self.precio,
            "id_tipo": self.id_tipo,
            "id_precio":self.id_precio,
            "url_img": self.url_img
        }

class Tipo_prod(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(100))
    productos = db.relationship('Producto',backref='tipo_prod',lazy=True)

    def __repr__(self):
        return f'<tipo: {self.nombre}>'
    
    def serialize(self):
        return{
            "id_tipo": self.id,
            "nombre":self.nombre,
        }
    
class Favorito(db.Model):
    id_user = db.Column(db.Integer,db.ForeignKey('user.id'),primary_key=True)
    id_prod = db.Column(db.Integer,db.ForeignKey('producto.id'),primary_key=True)

    def __repr__(self):
        return f'<id_user: {self.id_user} <-> id_prod: {self.id_prod}'
    
    def serialize(self):
        return{
            "id_user":self.id_user,
            "id_prod":self.id_prod
        }

class Pedido(db.Model):
    id = db.Column(UUID(as_uuid=True),primary_key=True)
    id_user = db.Column(db.Integer,db.ForeignKey('user.id'),nullable=False)
    id_prod = db.Column(db.Integer,db.ForeignKey('producto.id'),primary_key=True)
    fecha = db.Column(db.DateTime)
    cantidad = db.Column(db.Integer)

    def __repr__(self):
        return f'<id_pedido: {self.id}, id_user: {self.id_user}, id_prod: {self.id_prod}, cantidad: {self.cantidad}, fecha: {self.fecha}>'
    
    def serialize(self):
        return{
            "id":self.id,
            "id_user":self.id_user,
            "id_prod":self.id_prod,
            "cantidad":self.cantidad,
            "fecha":self.fecha
        }

class Carrito(db.Model):
    id_user = db.Column(db.Integer,db.ForeignKey('user.id'),primary_key=True)
    id_prod = db.Column(db.Integer,db.ForeignKey('producto.id'),primary_key=True)
    cantidad = db.Column(db.Integer)

    def __repr__(self):
        return f'<id_user : {self.id_user}, id_producto: {self.id_prod}, cantidad: {self.cantidad}>'
    
    def serialize(self):
        return{
            "id_user" : self.id_user,
            "id_producto": self.id_prod,
            "cantidad": self.cantidad
        }
class PedidoLocal(db.Model):
    id = db.Column(UUID(as_uuid=True),primary_key=True)
    email = db.Column(db.String,nullable=False)
    id_prod = db.Column(db.Integer,db.ForeignKey('producto.id'),primary_key=True)
    fecha = db.Column(db.DateTime)
    cantidad = db.Column(db.Integer)

    def __repr__(self):
        return f'<id_pedido: {self.id}, email: {self.email}, id_prod: {self.id_prod}, cantidad: {self.cantidad}, fecha: {self.fecha}>'
    
    def serialize(self):
        return{
            "id":self.id,
            "email":self.email,
            "id_prod":self.id_prod,
            "cantidad":self.cantidad,
            "fecha":self.fecha
        }