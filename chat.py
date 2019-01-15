import asyncio
import json
import websockets
import time
from datetime import datetime

HISTORY = {}
USERS = set()

async def notify_state( message, timestamp, sender ):
	if USERS:
		message = json.dumps( {'type': 'message', 'content': message, 'timestamp': timestamp, 'from': sender } )
		await asyncio.wait([user.send(message) for user in USERS])

async def register(websocket):
	USERS.add(websocket)

async def deregister(websocket):
	USERS.remove(websocket)
	await notify_state('A user left', time.time(), None)

async def processor( websocket, path ):
	await register(websocket)
	try:
		async for message in websocket:
			data = json.loads(message)
			timestamp = time.time()
			human_readable_timestamp = datetime.utcfromtimestamp( timestamp ).strftime( '%Y-%m-%d %H:%M:%S' )
			if data['type'] == 'register':
				message = data['name'] + ' joined'
				HISTORY[timestamp] = (data['name'], message)
				print(human_readable_timestamp + ' - registered ' + data['name'])
				await notify_state(message, human_readable_timestamp, data['name'])
			elif data['type'] == 'message':
				HISTORY[timestamp] = (data['name'], data['message'])
				print(human_readable_timestamp + ' - ' + data['name'] + ': ' + data['message'])
				await notify_state(data['message'], human_readable_timestamp, data['name'])
	finally:
		await deregister(websocket)

print('Running on 0.0.0.0 on port 80')
asyncio.get_event_loop().run_until_complete( websockets.serve( processor, '0.0.0.0', 80 ) )
asyncio.get_event_loop().run_forever()
