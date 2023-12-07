import { useSelector, useDispatch } from 'react-redux'
import { authedUser } from '../reducers/data'
import { loginAPI, logoutAPI } from '../utils/api'
import { useState } from 'react';
import { Link } from "react-router-dom";
import {Form,
    Row,
Col,
Navbar,
Container} from 'react-bootstrap';
import {Button} from '@mui/material';

function NavTop(){
    let dispatch = useDispatch()
    const current_user = useSelector(authedUser)

    let [showLogin, setShowLogin] = useState(false)
    let [loginState, setLoginState] = useState(true)

    const login=()=>{
        let user = document.getElementById("username").value
        let pass = document.getElementById("password").value
        dispatch(loginAPI({"username":user, "password": pass}))
        .then(res=>
            {if (res.error){
                setLoginState(false)
            } else {
                setLoginState(true)
            }})
    }

    const logout=()=>{
        dispatch(logoutAPI())
    }

    return(
        <>
        <Navbar className="bg-body-tertiary border-bottom m-0" data-bs-theme="light">
        <Container className='h-100'>
        <Navbar.Brand as={Link} to="/dashboard" className='d-flex'>
            <img
              alt=""
              src="/assets/images/logo.png"
              width="50"
              height="50"
              className="d-inline-block align-top"
            />
            <span className="d-flex align-items-center ms-2">IndEcX</span>
          </Navbar.Brand>     
          {current_user ? <Navbar.Collapse className="justify-content-end h-100 align-items-center ms-5">
          <Navbar.Text>
          <img
                src="/assets/images/user_icon.png"
                alt={`Avatar of ${current_user && current_user.last_name}`}
                style={{height : "40px", width: "40px"}}
                width="40"
                height="40"
            />          
          </Navbar.Text>
          <Navbar.Text className="d-flex align-items-center ms-md-2 navbar-text h-100 p-3">
            <div >
                {`${current_user && current_user.first_name} ${current_user && current_user.last_name}`}
            </div>           
          </Navbar.Text>
          <Navbar.Text onClick={() => logout()} className="d-flex align-items-center ms-md-4 navbar-text h-100 p-md-3 p-0 pe-1 nav-link">
            <div>Logout</div>
          </Navbar.Text>
        </Navbar.Collapse> 
        : showLogin ? 
        <form id="loginForm" onSubmit={(e)=>login(e)}>
            <Row className='d-flex align-items-center h-100'>
            <Col xs="auto">
            <Form.Control
                id="username"
                placeholder="Username"
                aria-label="Username"
                aria-describedby="basic-addon1"
                onKeyDown={(e) => (e.key === "Enter") && login()}
            />
            </Col>
            <Col xs="auto">
                <Form.Control
                id="password"
                type="password"
                placeholder="password"
                className=" mr-sm-2"
                onKeyDown={(e) => (e.key === "Enter") && login()}
                />
            </Col>
            <Col xs="auto">
            <Button type='button' variant="contained" className='m-auto me-0' onClick={()=>login()}>
          Login
        </Button>
            </Col>
            </Row>
            {!loginState && <Row className='d-flex align-items-start h-100 mt-1'>
                <p className='text-danger small' style={{textAlign:"left"}}>
              Login failed, please confirm your credentials 
            </p></Row>}
        </form>
        :
      <Navbar.Collapse className="justify-content-end h-100 align-items-center">
      <Navbar.Text onClick={()=>setShowLogin(!showLogin)} className="d-flex align-items-center ms-4 navbar-text h-100 p-3 nav-link">
        <div>Login</div>
      </Navbar.Text>
    </Navbar.Collapse>}  
        </Container>
        
        
      </Navbar>
      </>)


}


export default NavTop
