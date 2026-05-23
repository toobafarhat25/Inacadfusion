Set-Location "D:\Tooba3.0\ai_worker"
Write-Host "Setting up Virtual Environment..."
if (-not (Test-Path "venv")) {
    py -m venv venv
}

Write-Host "Activating Virtual Environment and Installing Requirements..."
.\venv\Scripts\python.exe -m pip install fastapi uvicorn pymongo pandas pydantic python-multipart
.\venv\Scripts\python.exe -m pip install torch --index-url https://download.pytorch.org/whl/cpu
.\venv\Scripts\python.exe -m pip install sentence-transformers

Write-Host "Starting AI Worker..."
.\venv\Scripts\python.exe main.py
