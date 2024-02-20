import { capitalizeFirstLetter } from "../utils/helpers"
import { dataData, dataOptions } from '../reducers/data';
import { useSelector } from 'react-redux';
import { useState } from "react";
import { FaChevronRight, FaChevronDown, FaCheck, FaTimes } from 'react-icons/fa';
import { order_dict } from "../utils/helpers";
import { img_ext, vid_ext } from "../config";

function Details({data, child, table}){
    const list_selector = useSelector(dataData)
    const list_options = useSelector(dataOptions)
    let list = list_selector[table] ? list_selector[table] : []

    if(child){
        data = list.filter(val=>val.id==data.id)[0]
    }
    data = data && order_dict(data).filter(([k, value])=>(k!="id" && k!="treeXLevel" && k!="treeYLevel" && k!="parentNode" && k!="ancestors" && k!="users"))
    
    let start = []
    if(child && data){
        start = data.slice(0,1);
        data = data.slice(1);
    }
    

    const [show, setShow] = useState(false)
    return (
                <table className="w-100">
                    <tbody>
                        <tr>
                            <td>
                                {child && start.map(([k, value])=>
                                    (<div key={`${k}detailc`} className="d-flex child" onClick={()=>setShow(!show)}>
                                        <span><strong>{`${capitalizeFirstLetter(k)}:`} </strong></span><span className="ms-4" >{typeof value == "object" ? value.name : value}</span><span className="d-flex align-items-center ms-2" style={{width:"10px"}}>{show?<FaChevronRight />:<FaChevronDown />}</span>
                                    </div>)
                                )}
                                {(!child || show) && data && data.map(([k, value])=>
                                    (<div key={`${k}detail`} className="d-flex">
                                        <span><strong>{`${capitalizeFirstLetter(k)}:`} </strong></span>
                                        <span className="ms-4" >
                                            {value && value.constructor === Array 
                                            ? value.map(val=>{
                                                return(
                                                <div key={val.id}><br/>
                                                {
                                                    list_options[table][k].name != "fieldoption"
                                                    ? <Details data={val} child={true} table={list_options[table][k].name}/>
                                                    : val.name
                                                }
                                                </div>)})
                                            : list_options[table][k].type == "boolean"
                                            ?  (value ? <FaCheck/> : <FaTimes/>)
                                            : list_options[table][k].type == "file upload"
                                            ?  (value && img_ext.includes(value.slice(-6).split(".").at(-1)) 
                                            ? <img src={value}/> 
                                            : vid_ext.includes(value.slice(-6).split(".").at(-1)) 
                                            ? (<video className="w-100" controls autoPlay>
                                                <source src="movie.ogg" type="video/ogg" />
                                                </video>)
                                            : value)
                                            : typeof value == "object" 
                                            ? <div><br/>
                                            {
                                                list_options[table][k].name != "fieldoption"
                                                ? <Details data={value} child={true} table={list_options[table][k].name}/>
                                                : value.name
                                            }
                                            </div>
                                            : (k.toLowerCase().includes("location") || k.toLowerCase().includes("url")) 
                                            && value.includes("http")
                                            ? <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
                                            : value}
                                            </span>
                                    </div>)
                                )}
                            </td>
                            </tr>                        
                    </tbody>
                </table>
    )
}

export default Details