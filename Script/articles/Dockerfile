# Use official Python runtime as base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install build dependencies, then install Python packages, then remove build deps
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    && pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    apt-get purge -y gcc g++ && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/* && \
    pip cache purge && \
    find /usr/local/lib/python3.11/site-packages -type d -name __pycache__ -exec rm -r {} + 2>/dev/null || true && \
    find /usr/local/lib/python3.11/site-packages -name "*.pyc" -delete

# Copy only necessary application code (excludes .env, __pycache__, etc. via .dockerignore)
COPY *.py ./

# Expose port (Cloud Run uses PORT env var, defaults to 8080)
EXPOSE 8080

# Set environment to production
ENV PYTHONUNBUFFERED=1
ENV PORT=8080

# Run the FastAPI application
# Cloud Run provides PORT env var, fallback to 8080
CMD sh -c "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8080}"
