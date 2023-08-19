import os
import openai
import json

openai.api_key = os.getenv('OPENAI_KEY')
if os.getenv('OPENAI_URL'):
    openai.api_base = os.getenv('OPENAI_URL')


def get_response(prompt):
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    message = response['choices'][0]['message']['content']
    return message

def get_response_stream_generator(prompt):
    response = openai.ChatCompletion.create(
        model='gpt-3.5-turbo',
        messages=[
            {'role': 'user', 'content': prompt}
        ],
        stream=True   
    )
    for resp in response:
        choice = resp['choices'][0]
        if('finish_reason' in choice and  choice['finish_reason']):
            yield '[DONE]'
            break
        delta_message = choice['delta']['content']
        yield delta_message