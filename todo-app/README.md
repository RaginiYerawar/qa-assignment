# Todo app

A small todo app with a frontend and a REST API.

## Start the app

You need Node.js 18 or later. The app has no dependencies, so you do not need `npm install`.

1. Open a terminal in this folder.
2. Run `npm start`.
3. Open http://localhost:3000 in your browser.

To use a different port, set `PORT`. For example: `PORT=4000 npm start`.

The app keeps its data in `data/todos.json`. To go back to the start data, stop the app and run `npm run reset-data`.

## API

Base URL: `http://localhost:3000/api`

All request and response bodies are JSON.

### The todo object

| Field       | Type    | Description                                     |
|-------------|---------|-------------------------------------------------|
| `id`        | string  | Unique ID, set by the server.                   |
| `text`      | string  | The text of the todo. 1 to 256 characters.      |
| `completed` | boolean | `true` if the todo is done.                     |
| `createdAt` | string  | ISO 8601 date and time, set by the server.      |
| `updatedAt` | string  | ISO 8601 date and time of the last change. Only present after a change. |

### Endpoints

#### `GET /api/health`

Returns `200` with `{"status": "ok"}`.

#### `GET /api/todos`

Returns `200` with an array of todos, oldest first.

Optional query parameters:

- `status`: `all` (default), `active` (not completed), or `completed`. Any other value returns `400`.
- `search`: returns only todos whose text contains this value. The match is not case-sensitive.

#### `POST /api/todos`

Creates a todo.

- Body: `{"text": "Buy milk"}`
- `text` is required. It must contain 1 to 256 characters, and it must not be only spaces.
- A new todo always starts with `completed: false`.
- Returns `201` with the new todo.
- Returns `400` with `{"error": "..."}` if the body is not valid.

#### `GET /api/todos/{id}`

Returns `200` with the todo, or `404` if no todo has this ID.

#### `PATCH /api/todos/{id}`

Changes a todo. Send only the fields that you want to change.

- Body: `{"completed": true}`, `{"text": "New text"}`, or both.
- The same rules for `text` apply as for `POST`.
- Returns `200` with the changed todo.
- Returns `400` if the body is not valid, or `404` if no todo has this ID.

#### `DELETE /api/todos/{id}`

Deletes a todo. Returns `204`, or `404` if no todo has this ID.

#### `DELETE /api/todos?completed=true`

Deletes all completed todos. Returns `200` with `{"deleted": <number>}`.

### Errors

All errors return a JSON body: `{"error": "<message>"}`.
