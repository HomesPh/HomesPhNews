# Use official Python runtime as base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port (Restaurants service uses port 8012)
EXPOSE 8012

# Set environment to production
ENV PYTHONUNBUFFERED=1

# Run the FastAPI application for restaurants service
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8012"]
