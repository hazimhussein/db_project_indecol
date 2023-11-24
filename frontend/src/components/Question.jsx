// import React, {Component} from 'react'
// import { connect } from 'react-redux'
// import { formatQuestion, formatDate } from '../utils/helpers'
// import { handleGetData, handleRemoveData } from '../actions/data'
// import {TiArrowBackOutline} from 'react-icons/ti'
// import {TiHeartOutline} from 'react-icons/ti'
// import {TiHeartFullOutline} from 'react-icons/ti'
// import { handleToggleQuestion } from '../actions/questions'
// import { Link, withRouter, Redirect } from 'react-router-dom'
// import {truncateText, capitalizeFirstLetter} from '../utils/helpers'
// import { Button, Confirm } from 'semantic-ui-react'
import { useNavigate } from "react-router-dom";
import { capitalizeFirstLetter } from "../utils/helpers";

function Question({ table, data }) {
  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(`/dashboard/${path}`);
  };

  let name = data.name ? data.name: "";
  let description = data.description ? data.description : "";
  let img = table == "category" ? data.name : table

  if (table == "person") {
    name = data.first_name + " " + data.last_name;
    description = data.role
  } else if (table == "user") {
    name = data.username;
    description = data.email
  } else if (table == "ressource") {
    name = data.full_name;
  } else if (table == "group") {
    description = data.persons.map(pers=><span>{pers.first_name} {pers.last_name}<br/></span>)
  } 
  return (
    <div className="wrap" onClick={() => routeChange(img)}>
      {/* <Link onClick={type==='Services' ?(()=>this.handleLink(service.name))
                                            : (()=>this.handleLink("Staff", service.name))}
                  to={service !== null && `/${type}/${service.name}`} > */}
      <div className="card">
        <div className="card-liner">
          <figure>
            <img src={`/assets/images/${img}.png`} />
          </figure>
          {table == "person" && <div className='card--social'>
                    <ul>
                      <li className='instagram'>
                        <a href={`tel:40557058`} onClick={((e)=>{e.stopPropagation();})} className='insta'>
                          <i className='fa fa-phone'></i>
                        </a>
                      </li>
                      <li className='codepen'>
                        <a href={`mailto:hazemhussein@windowslive.com`} onClick={((e)=>{e.stopPropagation();})}>
                          <i className='fa fa-envelope-o'></i>
                        </a>
                      </li>
                    </ul>
                  </div>}
          {!table && (
            <div className="card--social">
              <ul>
                <li className="instagram">
                  <a href="" className="insta">
                    <i className="fa fa-phone"></i>
                  </a>
                </li>
                <li className="codepen">
                  <a href="">
                    <i className="fa fa-envelope-o"></i>
                  </a>
                </li>
              </ul>
            </div>
          )}
          <div className="card--title">
            <h3>{capitalizeFirstLetter(name)}</h3>
            <p></p>
          </div>
          <div className="card--desc">
            <hr />
            <p>{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
{
  /* <div className='card--btn'>
                    <a href='#'>
                      <span className='moreInfo'>
                        <i className='fa fa-info-circle'></i>
                        CSS HOVER CARD
                      </span>
                      <span className='fullProf'>
                        Don't Forget to like
                        <i className='fa fa-heart'></i>
                      </span>
                    </a>
                  </div> */
}
{
  /* {!table && <div><button className="btn btn-primary editBtn" onClick={(this.handleEditLink)}>Edit</button>
                  <button className="btn btn-danger deleteBtn" onClick={((e)=>this.show(e))}>Delete</button>
                  <Confirm
                    open={open}
                    onCancel={((e)=>this.handleCancel(e))}
                    onConfirm={((e)=>this.handleConfirm(e, servicename, service.id))}
                  /></div>}
                  {category && <button className="btn btn-success addBtn" onClick={(this.handleAddLink)}>Add</button>}
                </div>
              </div>
              {!category &&
              <div id={`myModal${service && service.id}`} className="modalO"> */
}

{
  /* <!-- Modal Content --> */
}
{
  /* <img className="modal-content" id="img01" src={service && service.image !== null && ('image' in service) 
                              && Buffer.from(service.image).toString('base64') !== 'dW5kZWZpbmVk' 
                              ? ('data:image/png;base64,'+ Buffer.from(service.image).toString('base64'))
                              : service.gender === 'Male' ? '/male-avatar.png'
                              :'/female-avatar.png'}/>
                <ul className="modal-content">
                  {service && Object.keys(service).filter(key=> key !=="id" && key !=="image").map((key)=>
                  <li>{`${capitalizeFirstLetter(key)}: `} <span>{`${service[key]}`}</span></li>)}
                  {!category && <div className='modal-btn'><button className="btn btn-primary editBtn" onClick={(this.handleEditLink)}>Edit</button>
                  <button className="btn btn-danger deleteBtn" onClick={((e)=>this.show(e))}>Delete</button>
                  <Confirm
                    open={open}
                    onCancel={((e)=>this.handleCancel(e))}
                    onConfirm={((e)=>this.handleConfirm(e, servicename, service.id))}
                  /></div>}
                </ul> */
}

{
  /* <iframe class="modal-content" id="vid01" width="100%" height="75%" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> */
}

{
  /* <!-- The Close Button of the Modal --> */
}
{
  /* <span onClick={(()=>this.modalClose(service && service.id))} className="close">&times;</span>
              </div>} */
}
{
  /* </Link> */
}
{
  /* </div>
            // <div className='question'>
            //     <Link to={`/questions/${id}`}>
            //     <div className='question-head'>
            //         <span>{name} asks:</span>
            //         <div className='time'>{formatDate(timestamp)}</div>
            //     </div>
            //     <div className='question-body'>
            //     <img
            //         src={avatarURL}
            //         alt={`Avatar of ${name}`}
            //         className='avatar'
            //     />
            //     <div className='question-info'>
            //             <span>Would you rather:</span>
            //             <div>{truncateText(optionOne.text)}</div>

            //     </div>
            //     </div>
            // </Link>
            // </div> */
}

export default Question;
