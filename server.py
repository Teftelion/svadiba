from flask import Flask, request, jsonify
from flask_cors import CORS
import csv
import json
import os

app = Flask(__name__, static_folder="static")
CORS(app)

CSV_FILE = "rsvp.csv"
JSON_FILE = "rsvp.json"


# Создаём файлы, если их нет
def init_files():
    if not os.path.exists(CSV_FILE):
        with open(CSV_FILE, "w", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            writer.writerow(["name", "surname", "attendance", "guests", "diet", "comments"])

    if not os.path.exists(JSON_FILE):
        with open(JSON_FILE, "w", encoding="utf-8") as file:
            json.dump([], file, ensure_ascii=False, indent=4)


@app.route('/')
def home():
    return app.send_static_file("index.html")  # Загружаем главную страницу


@app.route('/submit', methods=['POST'])
def submit():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    try:
        # Сохраняем в CSV
        with open(CSV_FILE, "a", newline="", encoding="utf-8") as file:
            writer = csv.writer(file)
            writer.writerow([
                data.get("name", ""),
                data.get("surname", ""),
                data.get("attendance", ""),
                int(data.get("guests", 0)),
                data.get("diet", ""),
                data.get("comments", "")
            ])

        # Проверяем, существует ли JSON-файл
        if not os.path.exists(JSON_FILE):
            with open(JSON_FILE, "w", encoding="utf-8") as file:
                json.dump([], file, ensure_ascii=False, indent=4)

        # Загружаем JSON и добавляем новую запись
        with open(JSON_FILE, "r", encoding="utf-8") as file:
            json_data = json.load(file)

        json_data.append(data)

        with open(JSON_FILE, "w", encoding="utf-8") as file:
            json.dump(json_data, file, ensure_ascii=False, indent=4)

        return jsonify({"status": "success"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    init_files()  # Создаём файлы, если их нет
    app.run(debug=True)
