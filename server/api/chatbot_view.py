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
        # user_input = request.json['user_input']
        user_input = request.args.get('user_input') 
        # delta_message_generator = get_response_stream_generator(user_input)
        @stream_with_context
        def sse_events():
            # for delta in delta_message_generator:
            #     print('dd', delta)
            #     yield "data: {}\n\n".format(delta)
            #     time.sleep(0.5)
            for i in range(5):
                yield "data: {}\n\n".format(i)
                time.sleep(1)
            yield '[DONE]'
        return Response(sse_events(), mimetype="text/event-stream")
    except Exception as e:
        traceback.print_exc()
        return {'err': 'server_error'}