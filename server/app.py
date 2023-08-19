from dotenv import load_dotenv
load_dotenv()
from flask import Flask
from api import api

app = Flask(__name__, static_folder='./build', static_url_path='/')
app.register_blueprint(api, url_prefix='/api')

@app.route('/')
def index():
    return app.send_static_file('index.html')

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=9000, debug=True, threaded=True)