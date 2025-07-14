import torch
import requests
import cv2
from datetime import datetime
import time
import traceback
import sys

# Force CPU usage
torch.cuda.is_available = lambda: False

# Load the YOLOv5 model
try:
    model = torch.hub.load('ultralytics/yolov5', 'custom',
                           path='yolov5s.pt', force_reload=True)
except Exception as e:
    print(f"Error loading model: {e}")
    sys.exit(1)

# Video stream from ESP32-CAM
stream_url = 'http://192.168.10.199/video'

cap = cv2.VideoCapture(stream_url)

if not cap.isOpened():
    print("Error: Could not open video stream.")
    sys.exit(1)


# Time (in seconds) to wait before allowing another detection notification
DETECTION_COOLDOWN = 5
last_detection_time = 0

# Function to send vehicle detection request


def notify_vehicle_detected():
    try:
        timestamp = datetime.now().isoformat()
        payload = {"time": timestamp}
        # Use your actual endpoint
        response = requests.post(
            "https://tkttraffic.vercel.app/api/camera", json=payload)
        response.raise_for_status()
        print(
            f"[INFO] Vehicle detected at {timestamp}. POST sent successfully.")
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Failed to send vehicle detection: {e}")

# Main loop for detecting vehicles continuously


def stream_and_detect():
    global last_detection_time

    while cap.isOpened():
        try:
            ret, frame = cap.read()
            if not ret:
                print("[WARN] Failed to read frame.")
                continue

            # Convert to RGB and run detection
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = model(frame_rgb)
            detections = results.pandas().xyxy[0]

            # Check for relevant vehicle classes
            if any(name in ['car', 'truck', 'van', 'train'] for name in detections['name'].values):
                current_time = time.time()
                if current_time - last_detection_time >= DETECTION_COOLDOWN:
                    notify_vehicle_detected()
                    last_detection_time = current_time

            # Render and show (optional)
            results.render()
            frame_bgr = cv2.cvtColor(results.ims[0], cv2.COLOR_RGB2BGR)
            cv2.imshow('Vehicle Detection Stream', frame_bgr)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        except Exception as e:
            print(f"[ERROR] Exception in stream loop: {e}")
            print(traceback.format_exc())
            break

    cap.release()
    cv2.destroyAllWindows()


# Run the stream detection
stream_and_detect()
