import traceback
from flask import request, jsonify, Response, stream_with_context
from . import api
from .openai_service import get_response, get_response_stream_generator
import time

@api.route('/chat/get_ai_response', methods=['POST'])  
def get_ai_response():
    try:
        user_input = request.json['user_input']
        ai_response = get_response(user_input)
        return jsonify({'ai_response': ai_response})
    except Exception as e:
        traceback.print_exc()
        return {'err': 'server_error'}
    
@api.route('/chat/get_ai_response_stream', methods=['GET'])  
def get_ai_response_stream():
    try:
        user_input = request.args.get('user_input') 
        delta_message_generator = get_response_stream_generator(user_input)
        @stream_with_context
        def sse_events():
            for delta in delta_message_generator:
                yield "data: {}\n\n".format(delta)
        response = Response(sse_events(), mimetype="text/event-stream")
        response.headers['Content-Encoding'] = 'identity'
        return response
    except Exception as e:
        traceback.print_exc()
        return {'err': 'server_error'}