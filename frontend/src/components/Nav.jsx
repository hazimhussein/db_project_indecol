import {NavLink} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { authedUser } from '../reducers/data'
import { addTableRow, getTableData } from '../utils/api'

function Nav(){
    let dispatch = useDispatch()
    const current_user = useSelector(authedUser)

    const login=(user, pass)=>{
        dispatch(addTableRow("login", {"username":user, "password": pass}))
    }
    const logout=()=>{
        dispatch(addTableRow("logout"))
    }

    return(
        <nav className="">
            <div className="navbar navbar-expand-lg navbar-light bg-light container-fluid">
                <ul className="navbar-nav m-auto text-center fs-3 fw-bold">
                    <li className="nav-item">
                        <NavLink to='/' exact activeClassName='active' className="nav-link">
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
                    <div className="col-xs-4 text-center"><NavLink to='/' exact activeClassName='active'>
                            <i className="fa fa-home"></i>
                        </NavLink></div>
                    <div className="col-xs-4 text-center"><a href="#"><i className="fa fa-cog"></i></a></div>
                </div>
            </div>
        </nav>
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


export default Nav
