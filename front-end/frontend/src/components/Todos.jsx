import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

const TodosContext = React.createContext({
  todos: [],
  fetchTodos: () => {},
});

// Post Route Function
function AddTodo() {
  const [item, setItem] = React.useState("");
  const { todos, fetchTodos } = React.useContext(TodosContext); // Solo obtenemos el valor del contexto

  const handleInput = (event) => {
    setItem(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newTodo = {
      id: todos.length + 1,
      team: item,
    };

    fetch("http://localhost:8000/todo", {
      method: "POST",
      headers: { "Content-Type": "application/json" }, // "Headers" debe ser "headers"
      body: JSON.stringify(newTodo),
    }).then(fetchTodos);
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type="text"
          placeholder="Agrega un deporte"
          aria-label="Agrega un deporte"
          onChange={handleInput}
        />
      </InputGroup>
    </form>
  );
}

// PUT ROUTE
function UpdateTodo({item, id}) {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const [todo, setTodo] = useState(item)
  const {fetchTodos} = React.useContext(TodosContext)

  const updateTodo = async () => {
    await fetch(`http://localhost:8000/todo/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ team: todo })
    })
    onClose()
    await fetchTodos()
  }

  return (
    <>
    
      <Button
  h="2rem"           // Increase the height
  fontSize="1rem"    // Increase the font size
  fontWeight="bold"  // Make the text bold
  colorScheme="twitter" // Change the color scheme (you can choose from different color schemes)
  borderRadius="10px" // Add rounded corners
  boxShadow="md"     // Add a small box shadow
  _hover={{
    bg: 'facebook.500',   // Change the background color on hover
          }}
  size="sm"
  onClick={onOpen}>Actualizar deporte</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Actualizar deporte</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type="text"
                placeholder="Add a todo item"
                aria-label="Add a todo item"
                value={todo}  
                onChange={e => setTodo(e.target.value)}
              />
            </InputGroup>
          </ModalBody>

          <ModalFooter>
            <Button h="2rem"           // Increase the height
              fontSize="1rem"    // Increase the font size
              fontWeight="bold"  // Make the text bold
              colorScheme="twitter" // Change the color scheme (you can choose from different color schemes)
              borderRadius="10px" // Add rounded corners
              boxShadow="md"     // Add a small box shadow
              _hover={{
                bg: 'facebook.500',   // Change the background color on hover
                      }}
            size="sm"
            onClick={updateTodo}>Actualizar deporte</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

// Delete
function DeleteTodo({ id }) {
  const { fetchTodos } = React.useContext(TodosContext);

  const deleteTodo = async () => {
    try {
      await fetch(`http://localhost:8000/todo/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      await fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <Button
      h="2rem"
      fontSize="1rem"
      fontWeight="bold"
      colorScheme="yellow"
      borderRadius="10px"
      boxShadow="md"
      _hover={{
        bg: "red.500",
      }}
      size="sm"
      onClick={deleteTodo}
    >
      Eliminar
    </Button>
  );
}

function TodoHelper({item, id, fetchTodos}) {
  return (
    <Box p={1} shadow="sm">
      <Flex justify="space-between">
        <Text mt={4} as="div">
          {item}
          <Flex align="end">
            <UpdateTodo item={item} id={id} fetchTodos={fetchTodos}/>
            <DeleteTodo id={id} fetchTodos={fetchTodos}/>  {/* new */}
          </Flex>
        </Text>
      </Flex>
    </Box>
  )
}

export default function Todos() {
  const [todos, setTodos] = useState([]);
  const fetchTodos = async () => {
    const response = await fetch("http://localhost:8000/todo");
    const todos = await response.json();
    setTodos(todos.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <TodosContext.Provider value={{ todos, fetchTodos }}>
      <AddTodo />
      <Stack spacing={5}>
        {todos.map((todo) => (
          //   <b>{todo.team}</b>
          <TodoHelper item={todo.team} id={todo.id} fetchTodos={fetchTodos} />
        ))}
      </Stack>
    </TodosContext.Provider>
  );
}
