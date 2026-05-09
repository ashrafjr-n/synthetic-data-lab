from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import requests
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv("MY_API_KEY")

@app.route("/api/data", methods=["GET"])
def get_data():

    response = requests.get(
        "https://api.example.com/endpoint",
        headers={"Authorization": f"Bearer {API_KEY}"}
    )
    return jsonify(response.json())

if __name__ == "__main__":
    app.run(debug=True)