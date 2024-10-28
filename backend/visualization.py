import os
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import matplotlib
import matplotlib.pyplot as plt
matplotlib.use('Agg')
import numpy as np
from sorting import BubbleSort, QuickSort, InsertionSort

app = Flask(__name__)
CORS(app, resources={r"/sort-array": {"origins": "http://127.0.0.1:5500"}})

FRAME_FOLDER = r'\backend\frames'
os.makedirs(FRAME_FOLDER, exist_ok=True)

import matplotlib.pyplot as plt
import os

def visualizer(array, algorithm):
    plt.clf() 
    fig, ax = plt.subplots()
    fig.patch.set_facecolor('#2a152e')  # Change 'lightgray' to your desired color
    ax.set_facecolor('#2a152e')
    ax.set_xlim(0, len(array))
    ax.set_ylim(0, int(1.1 * max(array)))
    ax.axis('off')
    plt.grid(False)
    plt.title(f'{algorithm.__name__.capitalize()} Sort Animation') 

    # Clear any existing frames in the folder
    for filename in os.listdir(FRAME_FOLDER):
        file_path = os.path.join(FRAME_FOLDER, filename)
        if os.path.isfile(file_path):
            os.remove(file_path)

    frame_urls = []

    for i, step in enumerate(algorithm(array)):
        plt.clf()
        ax = plt.gca()
        ax.axis('off')
        bars = ax.bar(range(len(step)), step, align="edge", color="#d43965")

        for bar in bars:
            yval = bar.get_height()
            ax.text(bar.get_x() + bar.get_width() / 2, yval, int(yval), 
                    ha='center', va='bottom', color='#d43965', size='medium') 

        # Save each step as a frame
        frame_path = os.path.join(FRAME_FOLDER, f"frame_{i}.png")
        plt.savefig(frame_path)
        frame_urls.append(f"/frames/frame_{i}")

        plt.pause(0.005)

    plt.close(fig)
    
    return frame_urls

# Route to initiate sorting and generate frames
@app.route('/sort-array', methods=['POST'])
def sort_array():
    data = request.get_json()
    if not data or 'array' not in data or 'algorithm' not in data:
        return jsonify({"error": "Invalid input"}), 400
    array = data['array']
    algorithm = data['algorithm']

    # Select the sorting generator based on the algorithm
    if algorithm == 'bubble':
        sorter = BubbleSort().bubble_sort
    elif algorithm == 'insertion':
        sorter = InsertionSort().insertion_sort
    elif algorithm == 'quick':
        sorter = QuickSort().quick_sort
    else:
        return jsonify({"error": "Invalid algorithm"}), 400

    # Visualize sorting and generate frames
    sorted_array = visualizer(array, sorter)

    # Prepare frame URLs
    frame_urls = [f"http://127.0.0.1:5000/frames/{i}" for i in range(len(sorted_array))]
    return jsonify({"sorted_array": sorted_array, "frame_urls": frame_urls})

@app.route('/frames/<int:frame_id>', methods=['GET'])
def get_frame(frame_id):
    frame_path = os.path.join(FRAME_FOLDER, f"frame_{frame_id}.png")
    if os.path.exists(frame_path):
        return send_file(frame_path, mimetype='image/png')
    else:
        return jsonify({"error": "Frame not found"}), 404


if __name__ == "__main__":
    app.run(debug=True)
