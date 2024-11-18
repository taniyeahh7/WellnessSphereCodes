from flask import Flask, render_template, request, jsonify, json, Response
from flask_cors import CORS, cross_origin
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import cv2
import mediapipe as mp
import numpy as np
import PoseModule as pm

app = Flask(__name__)
CORS(app)


##### recipe generator #####
def filter_recipes(data, cannot_have):
    filtered_data = data.copy()
    for ingredient in cannot_have:
        filtered_data = filtered_data[~filtered_data['Cleaned-Ingredients'].str.contains(ingredient.strip().lower())]
    return filtered_data

def convert_to_builtin_type(obj):
    if isinstance(obj, np.int64):
        return int(obj)
    
def get_user_limits(given):
    m_given = given.strip().lower().split(',')
    return m_given

@app.route('/api/ingredform',methods =['POST'])
def index():
    if request.method == 'POST':
        #processing data from request
        req_ipr = request.get_json('input_ingredients')
        input_ingredients = get_user_limits(req_ipr['input_ingredients'])
        cannot_have = get_user_limits(req_ipr['cannot_have'])
        unique_ingredients = set()
        for i in data['Cleaned-Ingredients']:
            for j in i.split(','):
                unique_ingredients.add(j.strip())        
        
        #generating recipes based on ML model
        vectorizer = TfidfVectorizer(vocabulary=unique_ingredients)
        ingredient_matrix = vectorizer.fit_transform(data['Cleaned-Ingredients'])

        input_ingredients_str = ', '.join(input_ingredients)
        input_ingredients_vector = vectorizer.transform([input_ingredients_str])

        similarities = cosine_similarity(input_ingredients_vector, ingredient_matrix)

        cannot_have_str = ', '.join(cannot_have)
        filtered_data = filter_recipes(data, cannot_have)

        filtered_similarities = similarities[:, filtered_data.index]

        top_6_index = filtered_similarities.argsort()[0][-6:][::-1]


        top_recipes = []
        for i in top_6_index:
            recipe_info = {
                'name': filtered_data.iloc[i]['TranslatedRecipeName'],
                'ingredients': filtered_data.iloc[i]['TranslatedIngredients'],
                'time': filtered_data.iloc[i]['TotalTimeInMins'],
                'instructions': filtered_data.iloc[i]['TranslatedInstructions'],
                'image': filtered_data.iloc[i]['image-url'],
            }
            top_recipes.append(recipe_info)

        json_data = json.dumps(top_recipes, default=convert_to_builtin_type)
        decoded_data = json.loads(json_data)

        response = jsonify({'top_recipes': decoded_data})
        response.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0'
        response.headers['Pragma'] = 'no-cache'
        response.headers['Expires'] = '0'
        return response

    return jsonify({'error': 'Invalid request format'})
 
 
##### virtual trainer #####
mp_drawing = mp.solutions.drawing_utils
mp_pose = mp.solutions.pose
video_capture = None

counter = 0
stage = None

pose = mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

# push-up counter variables
pushup_count = 0
pushup_direction = 0
pushup_form = 0
pushup_feedback = "Fix Form"
video_capture_pushup = None

# curl counter variables
curl_counter = 0
curl_stage = None
video_capture_curl = None

# create PoseDetector instance for push-up
pushup_detector = pm.poseDetector()

# create Mediapipe Pose instance for curl
curl_pose = mp.solutions.pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5)

# function to detect pushups with feedback
def detect_pushups(frame):
    global pushup_count, pushup_direction, pushup_form, pushup_feedback

    frame = pushup_detector.findPose(frame, False)

    lmList = pushup_detector.findPosition(frame, False)
    if len(lmList) != 0:
        elbow = pushup_detector.findAngle(frame, 11, 13, 15)
        shoulder = pushup_detector.findAngle(frame, 13, 11, 23)
        hip = pushup_detector.findAngle(frame, 11, 23, 25)

        per = np.interp(elbow, (90, 160), (0, 100))
        bar = np.interp(elbow, (90, 160), (380, 50))

        if elbow > 160 and shoulder > 40 and hip > 160:
            pushup_form = 1  # Correct form detected

        if pushup_form == 1:
            # Check for "Up" position: Full extension of elbows
            if per == 0:
                if elbow <= 90 and hip > 160:  # Correct up position
                    pushup_feedback = "Up: Great! Keep your elbows straight."
                    if pushup_direction == 0:
                        pushup_count += 0.5
                        pushup_direction = 1  # Moving down
                else:
                    pushup_feedback = "Up: Ensure elbows are fully extended."

            # Check for "Down" position: Elbow angle at 160 degrees or less
            if per == 100:
                if elbow > 160 and shoulder > 40 and hip > 160:  # Correct down position
                    pushup_feedback = "Down: Keep going! Elbows should be at 90 degrees."
                    if pushup_direction == 1:
                        pushup_count += 0.5
                        pushup_direction = 0  # Moving up
                else:
                    pushup_feedback = "Down: Lower your chest and elbows properly."

        # Visual feedback for progress and form - Progress Bar
        if pushup_form == 1:
            cv2.rectangle(frame, (580, 50), (600, 370), (50, 50, 50), 3)
            cv2.rectangle(frame, (580, int(bar)), (600, 370), (255, 255, 255), cv2.FILLED)
            cv2.putText(frame, f'{int(per)}%', (570, 395), cv2.FONT_HERSHEY_TRIPLEX, 0.8, (255, 255, 255), 2)  

        # Push-up count display
        cv2.rectangle(frame, (10, 350), (90, 400), (50, 50, 50), cv2.FILLED)  
        cv2.putText(frame, str(int(pushup_count)), (20, 380), cv2.FONT_HERSHEY_TRIPLEX, 1.0, (255, 255, 255), 1)

        # Feedback message display
        cv2.rectangle(frame, (20, 40), (500, 80), (50, 50, 50), cv2.FILLED)
        cv2.putText(frame, pushup_feedback, (30, 65), cv2.FONT_HERSHEY_TRIPLEX, 0.5, (255, 255, 255), 1) 

    return frame

# function to process curls with feedback
def process_curl_image(frame):
    global curl_counter, curl_stage

    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    image.flags.writeable = False

    results = curl_pose.process(image=image)

    image.flags.writeable = True
    image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

    curl_feedback = "Ensure your arm is visible to the camera for accurate detection."

    try:
        landmarks = results.pose_landmarks.landmark

        shoulder = [landmarks[mp.solutions.pose.PoseLandmark.RIGHT_SHOULDER.value].x,
                    landmarks[mp.solutions.pose.PoseLandmark.RIGHT_SHOULDER.value].y]
        elbow = [landmarks[mp.solutions.pose.PoseLandmark.RIGHT_ELBOW.value].x,
                 landmarks[mp.solutions.pose.PoseLandmark.RIGHT_ELBOW.value].y]
        wrist = [landmarks[mp.solutions.pose.PoseLandmark.RIGHT_WRIST.value].x,
                 landmarks[mp.solutions.pose.PoseLandmark.RIGHT_WRIST.value].y]

        def Calculate_angle(a, b, c):
            a = np.array(a)  # first landmark - shoulder
            b = np.array(b)  # second landmark - elbow
            c = np.array(c)  # third landmark - wrist
            radians = np.arctan2(c[1] - b[1], c[0] - b[0]) - np.arctan2(a[1] - b[1], a[0] - b[0])
            angle = np.abs(radians * 180 / np.pi)
            if angle > 180.0:
                angle = 360 - angle
            return angle

        angle = Calculate_angle(shoulder, elbow, wrist)

        # Curl Logic with Feedback
        if angle > 160:
            curl_stage = "down"
            curl_feedback = "Lower your arm fully to complete the curl."  # Feedback for "down" stage

        if angle < 30 and curl_stage == 'down':
            curl_stage = "up"
            curl_counter += 1
            curl_feedback = "Nice curl! Bring your arm all the way up."  # Feedback for "up" stage
            print(curl_counter)

    except:
        curl_feedback = "Ensure your arm is visible to the camera for accurate detection."

    # Display background box for feedback
    cv2.rectangle(image, (0, 0), (600, 90), (50, 50, 50), -1)

    # Display feedback text
    cv2.putText(image, curl_feedback, (10, 75),
                cv2.FONT_HERSHEY_TRIPLEX, 0.5, (255, 255, 255), 1, cv2.LINE_AA)

    # Display background box for REPS and STAGE
    cv2.rectangle(image, (0, 380), (150, 430), (50, 50, 50), -1)

    # Display REPS count
    cv2.putText(image, str(curl_counter),
                (20, 410),
                cv2.FONT_HERSHEY_TRIPLEX, 0.5, (255, 255, 255), 1, cv2.LINE_AA)

    # Display STAGE information
    cv2.putText(image, curl_stage,
                (40, 410),
                cv2.FONT_HERSHEY_TRIPLEX, 0.5, (255, 255, 255), 1, cv2.LINE_AA)

    # Draw landmarks
    mp.solutions.drawing_utils.draw_landmarks(image, results.pose_landmarks,
                                              mp.solutions.pose.POSE_CONNECTIONS,
                                              mp.solutions.drawing_utils.DrawingSpec(
                                                  color=(245, 117, 66), thickness=2, circle_radius=2),
                                              mp.solutions.drawing_utils.DrawingSpec(
                                                  color=(245, 66, 230), thickness=2, circle_radius=2)
                                              )

    return image

# function to generate frames for push-up counter ^_^
def generate_pushup_frames():
    global video_capture_pushup

    video_capture_pushup = cv2.VideoCapture(0)

    while video_capture_pushup.isOpened():
        ret, frame = video_capture_pushup.read()

        if not ret:
            break

        frame = detect_pushups(frame)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# function to generate frames for curl counter ^_^
def generate_curl_frames():
    global video_capture_curl
    video_capture_curl = cv2.VideoCapture(0)

    while video_capture_curl.isOpened():
        ret, frame = video_capture_curl.read()

        if not ret:
            break

        frame = process_curl_image(frame)

        ret, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

# route for push-up counter
@app.route('/pushup_counter')
def pushup_counter_page():
    return render_template('pushup.html', count=int(pushup_count), feedback=pushup_feedback)

# route for push-up counter video feed
@app.route('/api/pushup_feed')
def pushup_feed():
    return Response(generate_pushup_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# route for stopping push-up counter video feed :)
@app.route('/api/stop_pushup_feed')
def stop_pushup_feed():
    global video_capture_pushup, pushup_count, pushup_direction, pushup_form, pushup_feedback

    if video_capture_pushup is not None:
        video_capture_pushup.release()
        video_capture_pushup = None

    pushup_count = 0
    pushup_direction = 0
    pushup_form = 0
    pushup_feedback = "Fix Form"
    return "stopped"
    
# route for curl counter
@app.route('/curl_counter')
def curl_counter_page():
    return render_template('curl.html', curl_count=curl_counter, curl_stage=curl_stage)

# route for curl counter video feed
@app.route('/api/curl_feed')
def curl_feed():
    return Response(generate_curl_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

# route for stopping curl counter video feed :)
@app.route('/api/stop_curl_feed')
def stop_curl_feed():
    global video_capture_curl, curl_counter, curl_stage

    if video_capture_curl is not None:
        video_capture_curl.release()
        video_capture_curl = None

    curl_counter = 0
    curl_stage = None
    return "stopped"

### DRIVER CODE ###
if __name__ == '__main__':
    data = pd.read_csv('Cleaned_Indian_Food_Dataset.csv', encoding='utf-8')
    app.run(host = '0.0.0.0', debug = False)