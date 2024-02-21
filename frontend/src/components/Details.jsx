import { capitalizeFirstLetter } from "../utils/helpers"
import { dataData, dataOptions } from '../reducers/data';
import { useSelector } from 'react-redux';
import { useState } from "react";
import { FaChevronRight, FaChevronDown, FaCheck, FaTimes } from 'react-icons/fa';
import { order_dict } from "../utils/helpers";
import { img_ext, vid_ext } from "../config";
import ListItemButton from '@mui/material/ListItemButton';

function Details({className, data, child, table}){
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
                <table className={`w-100 ${className}`}>
                    <tbody>
                        <tr>
                            <td>
                                {child && start.map(([k, value])=>
                                    (<ListItemButton key={`${k}detailc`} className="d-flex" onClick={()=>setShow(!show)}>
                                        {table != "faq" && <span><strong>{`${capitalizeFirstLetter(k)}:`} </strong></span>}
                                        <span className="ms-4" >{typeof value == "object" ? value.name : value}</span><span className="d-flex align-items-center ms-2" style={{width:"10px"}}>{show?<FaChevronRight />:<FaChevronDown />}</span>
                                    </ListItemButton>)
                                )}
                                {(!child || show) && data && data.map(([k, value])=>
                                    (table != "faq" || (k != "manual" && k != "admin")) && (<div key={`${k}detail`} className="d-flex ms-3 mt-3">
                                        {table != "faq" && <span><strong>{`${capitalizeFirstLetter(k)}:`} </strong></span>}
                                        <span className={`ms-4 ${table == "faq" && k =="media" && "w-100 d-flex justify-content-center"}`} >
                                            {value && value.constructor === Array 
                                            ? (
                                                <><br/>
                                            {value.map(val=>{
                                                return(
                                                <div key={val.id}>
                                                {
                                                    list_options[table][k].name != "fieldoption"
                                                    ? <Details data={val} child={true} table={list_options[table][k].name}/>
                                                    : val && val.name
                                                }
                                                </div>)})}
                                                </>)
                                            : list_options[table][k].type == "boolean"
                                            ?  (value ? <FaCheck/> : <FaTimes/>)
                                            : list_options[table][k].type == "file upload"
                                            ?  (value && img_ext.includes(value.slice(-6).split(".").at(-1)) 
                                            ? <div><img src={value}/></div> 
                                            : vid_ext.includes(value.slice(-6).split(".").at(-1)) 
                                            ? (<video controls autoPlay loop>
                                                <source src={value} />
                                                </video>)
                                            : value)
                                            : typeof value == "object" 
                                            ? <div>
                                            {
                                                list_options[table][k].name != "fieldoption"
                                                ? <Details data={value} child={true} table={list_options[table][k].name}/>
                                                : value && value.name
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