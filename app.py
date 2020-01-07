#!/usr/bin/env python
from flask import Flask
from flask import request

from up2down_model.up2down_model import up2down

app = Flask(__name__)

@app.route('/',methods=['GET'])
def get_couplet_down():
    couplet_up = request.args.get('upper','')

    couplet_down = up2down.get_down_couplet([couplet_up])

    return couplet_up + "," + couplet_down[0]

if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)
