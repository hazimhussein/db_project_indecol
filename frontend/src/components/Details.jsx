import { capitalizeFirstLetter } from "../utils/helpers"

function Details({data}){
    console.log(data)
    return (
        <>
          <tr className="d-flex w-100" style={{gridColumn: "1 / -1" }}>
            <td >
                <table className="w-100">
                    <tbody>
                        <tr>
                            <td>
                                {Object.entries(data).filter(([k, value])=>(k!="id" && k!="treeXLevel" && k!="treeYLevel" && k!="parentNode" && k!="ancestors" && k!="users")).map(([k, value])=>
                                    (<div key={k} className="d-flex">
                                        <span><strong>{`${capitalizeFirstLetter(k)}:   `} </strong></span><span>{value && value.constructor === Array ? value.map(val=>{return(<div><br/><Details data={val}/></div>)}): value}</span>
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