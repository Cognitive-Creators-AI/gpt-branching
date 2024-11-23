# GPT Branching Backend

This is the backend server for the GPT Branching application. It handles OpenAI API calls and provides a REST API for the frontend.

## Deployment to Heroku

1. Create a new Heroku app:
```bash
heroku create gpt-branching-api
```

2. Set environment variables:
```bash
heroku config:set OPENAI_API_KEY=your_api_key_here
```

3. Deploy the backend:
```bash
git init
git add .
git commit -m "Initial backend commit"
git push heroku master
```

4. Verify the deployment:
```bash
heroku logs --tail
```

## Local Development

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create .env file with:
```
OPENAI_API_KEY=your_api_key_here
```

4. Run the server:
```bash
python chat.py
```

The server will start on port 3001 by default.
