import { Card, Button } from 'react-bootstrap';

const CardTask = ({ task, deleteTask, setDescricao, setPrioridade, setTitulo, setEditing }) => {

    const handleUpdate = () => {
        console.log(task)
        setDescricao(task.descricao)
        setPrioridade(task.prioridade)
        setTitulo(task.titulo)
        setEditing({id: task.id, edit: true})
    }
    return (
        <Card className="mb-2">
            <Card.Header as="h5">{task.titulo}</Card.Header>
            <Card.Body>
                <Card.Text>
                {task.descricao}
                </Card.Text>
            <Button onClick={() => deleteTask(task.id)}>Excluir</Button>
            <Button className="ms-3" onClick={handleUpdate}>Editar</Button>
            </Card.Body>
        </Card>
    )
}

export default CardTask