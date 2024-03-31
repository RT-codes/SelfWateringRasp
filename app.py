from flask import Flask, render_template, request, jsonify, url_for
import json, uuid, os

app = Flask(__name__)

def load_config():
    with open('config/config.json') as config_file:
        config = json.load(config_file)
    return config

def get_plant_data():
    with open('plant_data/plants.json') as plants_file:
        return json.load(plants_file)

app_config = load_config()

@app.route('/')
def home():
    plants = get_plant_data()
    return render_template('index.html', plants=plants)

@app.route('/add-plant', methods=['POST'])
def add_plant():
    plant_name = request.form['name']
    plant_type = request.form['type']
    image_file = request.files['image']
    filename = str(uuid.uuid4()) + os.path.splitext(image_file.filename)[1]
    image_path = os.path.join('static', 'images', filename)
    image_file.save(image_path)
    image_link = url_for('static', filename=os.path.join('images', filename).replace('\\', '/'))

    plants = get_plant_data()
    plant_id = str(uuid.uuid4())
    plants.append({'name': plant_name, 'type': plant_type, 'image_link': image_link, 'id': plant_id})

    with open('plant_data/plants.json', 'w') as file:
        json.dump(plants, file, indent=4)

    return jsonify({"status": "success", "message": "Plant added"})

@app.route('/update-plant/<plant_id>', methods=['POST'])
def update_plant(plant_id):
    plant_name = request.form.get('name')
    plant_type = request.form.get('type')
    image_file = request.files.get('image')

    plants = get_plant_data()
    for plant in plants:
        if plant['id'] == plant_id:
            if image_file:
                filename = str(uuid.uuid4()) + os.path.splitext(image_file.filename)[1]
                image_path = os.path.join('static', 'images', filename)
                image_file.save(image_path)
                plant['image_link'] = url_for('static', filename=os.path.join('images', filename).replace('\\', '/'))
            if plant_type:
                plant['type'] = plant_type
            if plant_name:
                plant['name'] = plant_name
            break

    with open('plant_data/plants.json', 'w') as file:
        json.dump(plants, file, indent=4)

    return jsonify({"status": "success", "message": "Plant updated"})

@app.route('/delete-plant/<plant_id>', methods=['DELETE'])
def delete_plant(plant_id):
    plants = get_plant_data()
    plants = [plant for plant in plants if plant['id'] != plant_id]

    with open('plant_data/plants.json', 'w') as file:
        json.dump(plants, file, indent=4)

    return jsonify({"status": "success", "message": "Plant deleted"}), 200

if __name__ == '__main__':
    app.run(debug=True)
