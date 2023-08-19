import traceback
from flask import request, jsonify, Response, stream_with_context
from . import api
from .openai_service import get_response, get_response_stream_generator
import time 
import os 

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
        if os.getenv('IS_DEMO_MODE') == '1' or os.getenv('IS_DEMO_MODE') == 1 or os.getenv('IS_DEMO_MODE') == 'true':
            return mock_ai_response_stream()
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

def char_generator(text):
    for c in text:
        yield c
        time.sleep(0.05)
    yield '[DONE]'

def mock_ai_response_stream():
    text = '因为当前为DEMO模式，只会返回固定的回复内容，主要用于展示UI, 您可以下载源代码后，关闭DEMO模式，配置自己的openai key, 就可以得到gpt的回应。'
    text += '\n'
    text += 'Because it is currently in DEMO mode, only fixed reply content will be returned, mainly used to display the UI. You can download the source code, turn off DEMO mode, configure your own openai key, and receive a response from GPT.'
    
    delta_message_generator = char_generator(text)
    @stream_with_context
    def sse_events():
        for delta in delta_message_generator:
            yield "data: {}\n\n".format(delta)
    
    response = Response(sse_events(), mimetype="text/event-stream")
    response.headers['Content-Encoding'] = 'identity'
    return response

