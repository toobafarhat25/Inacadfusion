Set-Location "e:\tooba(inacadfusion0\Tooba3.0\ai_worker"
Write-Host "Setting up Virtual Environment..."
if (-not (Test-Path "venv")) {
    py -m venv venv
}

Write-Host "Installing lightweight ONNX-based requirements..."
.\venv\Scripts\python.exe -m pip install --upgrade pip
.\venv\Scripts\python.exe -m pip install fastapi "uvicorn[standard]" pymongo pydantic python-multipart numpy
.\venv\Scripts\python.exe -m pip install "optimum[onnxruntime]" transformers

Write-Host "Starting AI Worker on http://localhost:8000 ..."
.\venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
