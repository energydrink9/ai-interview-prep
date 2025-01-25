# Use the official Python image from the Docker Hub
FROM python:3.10-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install the dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Install Playwright browsers
RUN playwright install chromium-headless-shell

# Copy the rest of the application code into the container
COPY . .

# Expose the port the app runs on
ARG PORT=5328
EXPOSE ${PORT}

# Command to run the application
CMD ["sh", "-c", "gunicorn -w 4 -k uvicorn.workers.UvicornWorker index:app --bind 0.0.0.0:${PORT:-5328}"]
