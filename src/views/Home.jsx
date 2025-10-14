import { Button, Container } from "react-bootstrap";
import ListaUsuarios from "./ListaUsuarios";
import { Link } from "react-router-dom";


export default function Home(){
    return (
        <Container>
            <Button as={Link} to={"/lista-usuarios"}>Lista usuarios</Button>
        </Container>
        
    )
}