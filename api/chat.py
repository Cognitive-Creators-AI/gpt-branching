from http.server import BaseHTTPRequestHandler
from openai import OpenAI
import os
import json
from datetime import datetime

def handle_request(request):
    try:
        # Parse request body
        body = json.loads(request.get('body', '{}'))
        messages = body.get('messages', [])

        # Check API key
        api_key = os.environ.get('OPENAI_API_KEY')
        if not api_key:
            return {
                'statusCode': 500,
                'body': json.dumps({'error': 'OPENAI_API_KEY environment variable is not set'})
            }

        # Initialize OpenAI client
        client = OpenAI(api_key=api_key)

        # Make request to OpenAI
        response = client.chat.completions.create(
            model='gpt-4',
            messages=messages
        )

        # Return success response
        return {
            'statusCode': 200,
            'body': json.dumps({'reply': response.choices[0].message.content})
        }

    except json.JSONDecodeError as e:
        return {
            'statusCode': 400,
            'body': json.dumps({'error': f'Invalid JSON: {str(e)}'})
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'error': f'Server Error: {str(e)}'})
        }

def handler(request):
    if request.get('method') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            }
        }
    
    if request.get('method') != 'POST':
        return {
            'statusCode': 405,
            'body': json.dumps({'error': 'Method not allowed'})
        }

    response = handle_request(request)
    
    # Add CORS headers to all responses
    response['headers'] = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }
    
    return response
