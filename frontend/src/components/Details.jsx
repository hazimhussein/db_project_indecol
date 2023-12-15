import { capitalizeFirstLetter } from "../utils/helpers"
import { dataData } from '../reducers/data';
import { useSelector } from 'react-redux';
import { useState } from "react";
import { FaChevronRight, FaChevronDown } from 'react-icons/fa';


function Details({data, child, table}){
    if(child){
        const list_selector = useSelector(dataData)
        let list = list_selector[table] ? list_selector[table] : []
        console.log(list)
        data = list.filter(val=>val.id==data.id)[0]
        console.log(data)
    }
    data = data && Object.entries(data).filter(([k, value])=>(k!="id" && k!="treeXLevel" && k!="treeYLevel" && k!="parentNode" && k!="ancestors" && k!="users"))
    console.log(data)
    
    let start = []
    if(child){
        start = data.slice(0,1);
        data = data.slice(1);
    }

    const [show, setShow] = useState(false)
    return (
        <>
          <tr className="d-flex w-100" style={{gridColumn: "1 / -1" }}>
            <td >
                <table className="w-100">
                    <tbody>
                        <tr>
                            <td>
                                {child && start.map(([k, value])=>
                                    (<div key={k} className="d-flex child" onClick={()=>setShow(!show)}>
                                        <span><strong>{`${capitalizeFirstLetter(k)}:`} </strong></span><span className="ms-4" >{value}</span><span className="d-flex align-items-center ms-2" style={{width:"10px"}}>{show?<FaChevronRight />:<FaChevronDown />}</span>
                                    </div>)
                                )}
                                {(!child || show) && data && data.map(([k, value])=>
                                    (<div key={k} className="d-flex">
                                        <span><strong>{`${capitalizeFirstLetter(k)}:`} </strong></span><span className="ms-4" >{value && value.constructor === Array ? value.map(val=>{return(<div key={val.id}><br/><Details data={val} child={true} table={k == "related" ? "project" : k.slice(0,-1)}/></div>)}): value}</span>
                                    </div>)
                                )}
                            </td>
                            </tr>                        
                    </tbody>
                </table>
            </td>
          </tr>
      </>
    )
}

export default Details