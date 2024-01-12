import { useNavigate } from "react-router-dom";
import { capitalizeFirstLetter } from "../utils/helpers";

function Card({ table, data }) {
  let navigate = useNavigate();

  const routeChange = (path) => {
    if (table == "team"){
      window.location.href = path
    } else {
      navigate(`/dashboard/${path}`);
    }
  };

  let name = data.name ? data.name: "";
  let description = data.description ? data.description : "";
  let img = table == "category" ? `/assets/images/${name.toLowerCase()}.png` : table
  
  let url = "";
  let email = "";
  let phone = "";
  if (table == "team") {
    name = data.first_name + " " + data.last_name;
    description = data.role
    img = data.img_url
    url = data.url
    email = data.email ? data.email: ""
    phone = data.phone ? data.phone: ""
  } 

  return (
    <div className="wrap" onClick={() => routeChange(table == "team"? url : name.toLowerCase())}>
      {/* <Link onClick={type==='Services' ?(()=>this.handleLink(service.name))
                                            : (()=>this.handleLink("Staff", service.name))}
                  to={service !== null && `/${type}/${service.name}`} > */}
      <div className="card">
        <div className="card-liner">
          <figure>
            <img className={table == "team" ? "person" : undefined} src={img} onError={({ currentTarget }) => {
    currentTarget.onerror = null; // prevents looping
    currentTarget.src=`/assets/images/${table == "category"? "project": "person"}.png`;
  }}/>
          </figure>
          {table == "team" && <div className='card--social'>
                    <ul>
                      {phone != "" && <li className='instagram'>
                        <a href={`tel:${phone}`} onClick={((e)=>{e.stopPropagation();})} className='insta'>
                          <i className='fa fa-phone'></i>
                        </a>
                      </li>}
                      {email != "" && <li className='codepen'>
                        <a href={`mailto:${email}`} onClick={((e)=>{e.stopPropagation();})}>
                          <i className='fa fa-envelope-o'></i>
                        </a>
                      </li>}
                    </ul>
                  </div>}
          <div className="card--title">
            <h3>{capitalizeFirstLetter(name)}s</h3>
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

export default Card;
