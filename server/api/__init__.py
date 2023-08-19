# api/init.py

from flask import Blueprint

api = Blueprint('api', __name__, url_prefix='/api')

from . import openai_service, chatbot_view