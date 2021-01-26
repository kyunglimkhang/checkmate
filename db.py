from flask import current_app
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
# from config import DB_CONNECT

<<<<<<< HEAD
=======
#current_app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://elice:1234@localhost:3306/elice"
# current_app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://elice:miniproject2@localhost:3306/elice"
>>>>>>> feature/tasks
current_app.config["SQLALCHEMY_DATABASE_URI"] = f"mysql://{DB_CONNECT['username']}:{DB_CONNECT['password']}@{DB_CONNECT['server']}:3306/{DB_CONNECT['dbname']}"
current_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(current_app)

class User(UserMixin, db.Model):
      id = db.Column(db.Integer, primary_key=True)
      username = db.Column(db.String(15), unique=True, nullable=False)
      email = db.Column(db.String(50), unique=True, nullable=False)
      password = db.Column(db.String(80), nullable=False)
<<<<<<< HEAD
      institute = db.Column(db.String(45), nullable=True)

<<<<<<< HEAD
class Group(db.Model):
      id = db.Column(db.Integer, primary_key=True)
      username = db.Column(db.String(15), unique=True, nullable=False)
      institute = db.Column(db.String(45), nullable=True)
=======
class TodoList(UserMixin, db.Model):
      id = db.Column(db.Integer, primary_key=True)
      title = db.Column(db.String(20), nullable=False)
      start = db.Column(db.String(20), nullable=False)
      end = db.Column(db.String(20))

# class Group(db.Model):
#       id = db.Column(db.Integer, primary_key=True)
#       username = db.Column(db.String(15), unique=True, nullable=False)
#       institute = db.Column(db.String(45), nullable=True)
>>>>>>> feature/calendar_db

class TodoList(db.Model):
      id = db.Column(db.Integer, primary_key=True)
      title = db.Column(db.String(45), nullable=False)
      content = db.Column(db.Text, nullable=True)
      due = db.Column(db.DateTime, nullable=True)
      status = db.Column(db.String(45), nullable=True)
      user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
      group_id = db.Column(db.Integer, db.ForeignKey(Group.id), nullable=True)

Member = db.Table(
      'Member', 
      db.Column('user_id', db.Integer, primary_key=True),
      db.Column('group_id', db.Integer, primary_key=True),
      db.Column('role', db.String(45), nullable=False)
)

class Comment(db.Model):
      id = db.Column(db.Integer, primary_key=True)
      content = db.Column(db.Text, nullable=False)
      user_id = db.Column(db.Integer, db.ForeignKey(User.id), nullable=False)
      group_id = db.Column(db.Integer, db.ForeignKey(Group.id), nullable=False)
=======
>>>>>>> feature/tasks

def init_db():
      db.drop_all()
      db.create_all()
      db.session.commit()
