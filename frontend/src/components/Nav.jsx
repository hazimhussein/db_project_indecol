import {NavLink} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { authedUser } from '../reducers/data'
import { addTableRow, getTableData, loginAPI, logoutAPI } from '../utils/api'
import { useState, useEffect } from 'react';
import {Form,
    InputGroup,
    Row,
Col,
Nav,
Navbar,
Container} from 'react-bootstrap';
import {Button} from '@mui/material';

function NavTop(){
    let dispatch = useDispatch()
    const current_user = useSelector(authedUser)

    let [showLogin, setShowLogin] = useState(false)

    const login=()=>{
        let user = document.getElementById("username").value
        let pass = document.getElementById("password").value
        dispatch(loginAPI({"username":user, "password": pass}))
    }
    const logout=()=>{
        dispatch(logoutAPI())
    }
    
    // useEffect(()=>{
    //     current_user = useSelector(authedUser)
    // }, [dispatch])

    return(
        <>
        <Navbar className="bg-body-tertiary border-bottom m-0" data-bs-theme="light" style={{height:"80px"}}>
        <Container className='h-100'>
        <Navbar.Brand href="/" className='d-flex'>
            <img
              alt=""
              src="/assets/images/logo.png"
              width="50"
              height="50"
              className="d-inline-block align-top"
            />
            <span className="d-flex align-items-center ms-2">IndEcX</span>
          </Navbar.Brand>     
          {current_user ? <Navbar.Collapse className="justify-content-end h-100 align-items-center">
          <Navbar.Text>
          <img
                src="/assets/images/user_icon.png"
                alt={`Avatar of ${current_user && current_user.last_name}`}
                style={{height : "40px", width: "40px"}}
                width="40"
                height="40"
            />          
          </Navbar.Text>
          <Navbar.Text className="d-flex align-items-center ms-2 navbar-text h-100 p-3">
            <div >
                {`${current_user && current_user.first_name} ${current_user && current_user.last_name}`}
            </div>           
          </Navbar.Text>
          <Navbar.Text onClick={() => logout()} className="d-flex align-items-center ms-4 navbar-text h-100 p-3 nav-link">
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
            />
            </Col>
            <Col xs="auto">
                <Form.Control
                id="password"
                type="password"
                placeholder="password"
                className=" mr-sm-2"
                />
            </Col>
            <Col xs="auto">
            <Button type='button' variant="contained" className='m-auto me-0' onClick={()=>login()}>
          Submit
        </Button>
            </Col>
            </Row>
        </form>
        :
      <Navbar.Collapse className="justify-content-end h-100 align-items-center">
      <Navbar.Text onClick={()=>setShowLogin(!showLogin)} className="d-flex align-items-center ms-4 navbar-text h-100 p-3 nav-link">
        <div>Login</div>
      </Navbar.Text>
    </Navbar.Collapse>}  
        </Container>
        
        
      </Navbar>
        {/* <nav className="">
            <div className="navbar navbar-expand-lg navbar-light bg-light container-fluid">
                <ul className="navbar-nav m-auto text-center fs-3 fw-bold">
                    <li className="nav-item">
                        <NavLink to='/' className="active nav-link">
                            Home
                        </NavLink>
                    </li>
                </ul>
                <div className="nav-user">
                {current_user ? <div className='nav-avatar'>
                            <img
                            src="/assets/images/person.png"
                            alt={`Avatar of ${current_user && current_user.last_name}`}
                            className='avatar'
                            />
                            <div>
                            ${current_user && current_user.first_name} ${current_user && current_user.last_name}
                            </div>
                        </div>
                        : <div className='nav-avatar'>
                        <img
                        src="/assets/images/person.png"
                        alt={`Avatar of ${current_user && current_user.last_name}`}
                        className='avatar'
                        />
                        <div>
                        ${current_user && current_user.first_name} ${current_user && current_user.last_name}
                        </div>
                    </div>}
                </div>
                
            </div>
            <div className="col-xs-12 navbar-inverse navbar-fixed-bottom">
                <div className="row" id="bottomNav">
                    <div className="col-xs-4 text-center"><NavLink to='/' className='active'>
                            <i className="fa fa-home"></i>
                        </NavLink></div>
                    <div className="col-xs-4 text-center"><a href="#"><i className="fa fa-cog"></i></a></div>
                </div>
            </div>
        </nav> */}
        </>
    )
          {/* <a className="navbar-brand" href="#">
                <!--Logo png and style-->

                <div className="brand-img">
                <img src="assets/images/logo.png" alt="मैत्री - Maitrī" className="d-inline-block align-top"/>

                </div>
            </a> */}

            {/* <!--Collapsable menue code--> */}
            {/* <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#toggleMobileMenu"
             aria-controls="toggleMobileMenu" aria-expanded="false" aria-label="Toggle navigation">

                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="toggleMobileMenu"> */}

                {/* <!--Navigation bar items--> */}
                
                    {/* <li className="nav-item">
                        <a className="nav-link btn btn-block btn-social btn-twitter">
                            <i className="fa fa-twitter" aria-hidden="true"></i> <span>Sign in</span>
                          </a>
                    </li> */}
                    
                    {/* <li className="nav-item">
                        <NavLink to='/add' exact activeClassName='active' className="nav-link">
                            New Question
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to='/leaderboard' exact activeClassName='active' className="nav-link">
                            Leaderboard
                        </NavLink>
                    </li> */}
                        {/* <NavLink to='/' exact activeClassName='active' className="nav-link" onClick={signOut}>
                            Sign Out
                        </NavLink> */}
                
{/*

          <ul>
                <li>

                </li>
                <li>
                    <NavLink to='/add' exact activeClassName='active'>
                        New Question
                    </NavLink>
                </li>
                <li>
                    <NavLink to='/leaderboard' exact activeClassName='active'>
                        Leaderboard
                    </NavLink>
                </li>
                <li>
                    <div className='nav-avatar'>
                        <img
                        src={user.avatarURL}
                        alt={`Avatar of ${user.name}`}
                        className='avatar'
                        />
                        <div>
                            {user.name}
                        </div>
                    </div>
                    <NavLink to='/' exact activeClassName='active' onClick={signOut}>
                        Sign Out
                    </NavLink>
                </li>

            </ul> */}


}


export default NavTop
