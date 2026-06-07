import requests

res = requests.post("http://127.0.0.1:8000/recommend", json={"query": "I need a plumber", "top_n": 5})
print("Plumber:", res.json())

res = requests.post("http://127.0.0.1:8000/recommend", json={"query": "backend developer", "top_n": 5})
print("Backend:", res.json())
