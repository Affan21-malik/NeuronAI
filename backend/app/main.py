from fastapi import FastAPI

app = FastAPI(
    title="NeuronAI",
    description="Adaptive AI Technical Interview Agent",
    version="0.1.0",
)


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "neuronai",
    }