import requests

try:
    res = requests.post("http://localhost:5000/api/ai/recommend", json={"query": "backend developer", "top_n": 5})
    print("Node Backend:", res.json())
except Exception as e:
    print(e)
