from http.server import HTTPServer, BaseHTTPRequestHandler
import json
from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class ChatHandler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length)
            data = json.loads(body)
            messages = data.get('messages', [])

            # Check API key
            api_key = os.getenv('OPENAI_API_KEY')
            if not api_key:
                self._send_error_response(500, "OPENAI_API_KEY environment variable is not set")
                return

            # Initialize OpenAI client
            client = OpenAI(api_key=api_key)

            # Make request to OpenAI
            response = client.chat.completions.create(
                model='gpt-4',
                messages=messages
            )

            # Send success response
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            response_data = {'reply': response.choices[0].message.content}
            self.wfile.write(json.dumps(response_data).encode())

        except Exception as e:
            self._send_error_response(500, str(e))

    def _send_error_response(self, status_code, message):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        error_response = {'error': message}
        self.wfile.write(json.dumps(error_response).encode())

def run_server(port=3001):
    server_address = ('', port)
    httpd = HTTPServer(server_address, ChatHandler)
    print(f"Starting server on port {port}...")
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()
