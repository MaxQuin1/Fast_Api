from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Define the cors origins
origins = [
    'http://localhost:3000',
    'localhost:3000'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

# Get Route for testing


@app.get('/', tags=['root'])
async def read_root() -> dict:
    return {'message': '¡Bienvenido a FastApi!'}

todos = [
    {
        'id': '1',
        'team': 'Futbol',
        'img': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQxPX48l23CuZ07EmpoYxQAOk_uTHfHF8hMw&usqp=CAU'
    },
    {
        'id': '2',
        'team': 'Basquetbol',
    },
    {
        'id': '3',
        'team': 'Tenis',
        'img': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSijeKwZsWDUeByFK53yJAZVfTPHOIUWwOZg&usqp=CAU'
    },
    {
        'id': '4',
        'team': 'Natacion',
    }
]

# Get todos route


@app.get('/todo', tags=['todos'])
async def get_todos() -> dict:
    return {'data': todos}

# Post route


@app.post('/todo', tags=['todos'])
async def add_todo(todo: dict) -> dict:
    todos.append(todo)
    return {
        'data': {'¡todo has been added!'}
    }

# PUT ROUTE


@app.put("/todo/{id}", tags=["todos"])
async def update_todo(id: int, body: dict) -> dict:
    for todo in todos:
        if int(todo["id"]) == id:
            todo["team"] = body["team"]
            # todo["img"] = body["img"]
            return {
                "data": f"Todo with id {id} has been updated."
            }

    return {
        "data": f"Todo with id {id} not found."
    }

# Delete Route


@app.delete('/todo/{id}', tags=['todos'])
async def delete_todo(id: int) -> dict:
    for todo in todos:
        if int(todo['id']) == id:
            todos.remove(todo)
            return {
                'data': f'Todo with id {id} has been removed!'
            }
    return {
        'data': f'Todo with id {id} is not found!'
    }
