import { useState, useEffect } from "react";
import "./App.css";
import { FaLinkedin, FaReact } from "react-icons/fa";
import {
  Button,
  Container,
  Row,
  Col,
  Form,
  Stack,
  Spinner,
} from "react-bootstrap";
import CardTask from "./components/Card";
import api from "./services/api";

// const tasks = [
//   {
//     id: 1,
//     titulo: "Primeira Task",
//     descricao: "Descrição da Primeira Task",
//     prioridade: "URGENTE"
//   },
//   {
//     id: 2,
//     titulo: "Segunda Task",
//     descricao: "Descrição da Segunda Task",
//     prioridade: "URGENTE"
//   },
//   {
//     id: 3,
//     titulo: "Terceira Task",
//     descricao: "Descrição da Terceira Task",
//     prioridade: "URGENTE"
//   },
// ]

function App() {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setEditing] = useState({ id: "", edit: false});

  //POST
  const handleTask = async () => {
    if (titulo == "" || prioridade == "" || descricao == "") {
      alert("Preencha todos os campos");
      return;
    }

    const newTask = {
      titulo: titulo,
      descricao: descricao,
      prioridade: prioridade,
    };

    const { data } = await api.post("/tasks", newTask);
    setTaskList([...taskList, data]);
    console.log(data);

    //Devemos sempre atualizar o state com seu setState
    //para evitar problemas de renderização
    // tasks.push(newTask)

    setTitulo("");
    setDescricao("");
    setPrioridade("");
  };

  //DELETE
  const deleteTask = async (id) => {
    try {
      const { data, status } = await api.delete(`/tasks/${id}`);
      console.log(data, status);
      if (status == 200) {
        const updatedTaskList = taskList.filter((item) => item.id != data.id);
        setTaskList(updatedTaskList);
      }
    } catch (e) {
      console.log(e);
    }
  };

  //GET
  const getTasks = async () => {
    setLoading(true);
    const { data } = await api.get("/tasks");
    setTaskList(data);
    setLoading(false);
  };

  //UPDATE
  const updateTaskList = async () => {
    const newTask = {
      titulo: titulo,
      descricao: descricao,
      prioridade: prioridade,
    };

    const { data, status } = await api.put(`/tasks/${isEditing.id}`, newTask);
    console.log(data, status);
    if (status == 200) {
      const updatedTaskList = taskList.map(task => {
        if(task.id == data.id){
          return data
        }
        return task
      })
      setTaskList(updatedTaskList)
    }

    setTitulo("");
    setDescricao("");
    setPrioridade("");
    setEditing({id: "", edit: false})
  }
  useEffect(() => {
    getTasks();
  }, []);

  return (
    <Container className="bg-secondary">
      <h1 className="text-center">Lista de Tarefas</h1>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Título:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Insira o título"
            onChange={(e) => setTitulo(e.target.value)}
            value={titulo}
          />
        </Form.Group>
        <Form.Select
          aria-label="Default select example"
          onChange={(e) => setPrioridade(e.target.value)}
          value={prioridade}
        >
          <option>Escolha a prioridade</option>
          <option value="baixa">Baixa</option>
          <option value="normal">Normal</option>
          <option value="urgente">Urgente</option>
        </Form.Select>
        <Form.Group className="mb-3">
          <Form.Label>Descrição: </Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            onChange={(e) => setDescricao(e.target.value)}
            value={descricao}
          />
        </Form.Group>
        <Stack className="mb-3">
          {isEditing.edit ? (
            <>
              <Button className="" onClick={updateTaskList}>
                Salvar Tarefa
              </Button>
              <Button className="mt-2" onClick={() => setEditing({id: "", edit: false})}>
                Cancelar
              </Button>
            </>
          ) : (
            <Button className="" onClick={handleTask}>
              Cadastrar Nova Tarefa
            </Button>
          )}
        </Stack>
      </Form>

      <Stack>
        {loading && <Spinner animation="grow" variant="danger" />}
        {taskList.length > 0 &&
          taskList.map((item) => {
            return (
              <CardTask
                key={item.id}
                task={item}
                deleteTask={deleteTask}
                setTitulo={setTitulo}
                setDescricao={setDescricao}
                setPrioridade={setPrioridade}
                setEditing={setEditing}
              />
            );
          })}
      </Stack>
    </Container>
  );
}

export default App;
