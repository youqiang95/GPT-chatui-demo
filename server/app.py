from dotenv import load_dotenv
load_dotenv()
import os
from flask import Flask, request, jsonify, Response, stream_with_context
from api import api
import time

app = Flask(__name__, static_folder='./build', static_url_path='/')
app.register_blueprint(api, url_prefix='/api')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/test', methods=['GET'])  
def get_ai_response_stream():
    try:
        # user_input = request.json['user_input']
        user_input = request.args.get('user_input') 
        def sse_events():
            counter = 0

            while True:
                # Generate real-time data based on user input
                data = f"{user_input}: {counter}"
                yield "data: {}\n\n".format(data)
                counter += 1
                time.sleep(0.1)
                if counter > 10:
                    yield '[DONE]'
        response = Response(stream_with_context(sse_events()), mimetype="text/event-stream")
        response.headers["Cache-Control"] = "no-cache"
        response.headers["X-Accel-Buffering"] = "no"
        return response

    except Exception as e:
        # traceback.print_exc()
        return {'err': 'server_error'}

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=9000, debug=True, threaded=True)