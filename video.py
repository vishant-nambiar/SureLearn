import speech_recognition as sr 
import moviepy.editor as mp
import os
import sys

clip = mp.VideoFileClip( sys.argv[1] ) 
 
clip.audio.write_audiofile(r"converted.wav")

r = sr.Recognizer()
audio = sr.AudioFile("converted.wav")
with audio as source:
  audio_file = r.record(source)
text = r.recognize_google(audio_file)

import requests
import json
url = "https://question-generator.p.rapidapi.com/"

querystring = {"text":text}

r = requests.post(
    "https://api.deepai.org/api/summarization",
    data={
        'text': text,
    },
    headers={'api-key': '2cfaddf9-f1e7-47da-bdc8-017101626281'}
)
bp = r.json()




headers = {
    'x-rapidapi-key': "f2eed9bfd0msh2e7b8e60c2912d1p126f44jsn176f4a33b42d",
    'x-rapidapi-host': "question-generator.p.rapidapi.com"
    }

response = requests.request("GET", url, headers=headers, params=querystring)

dip = {"ques":response.text.split('?')}


bullet_points = []
bpr = [r.json()['output'].split('.')]
dictt = {"key":bpr[0]}




final_dict = {"summary":r.json()['output'], "checkYK": dip['ques'], "points": dictt['key']}
os.system('cls')
print(json.dumps(final_dict))