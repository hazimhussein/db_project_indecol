import { TextField } from "@mui/material"

function SearchGlob({ modifiedNodes, setModifiedNodes }){

    const search = (val) => {
        if (val == "") {
            return true
        }
        let filtered_nodes = modifiedNodes.filter((node)=>{
            for (const [key, value] of Object.entries(node)){
                if (value != "" && typeof value == "string"){
                  if (value.toLowerCase().includes(val.toLowerCase())){
                    return true
                  }
                } else if (typeof value == "object"){
                    for (const entry of value){
                        for (const [k, v] of Object.entries(entry)){
                            if (typeof v == "string" && v.toLowerCase().includes(val.toLowerCase())){
                                return true
                              }
                        }
                    }
                    
                }
            }
            return  false 
        })
        setModifiedNodes(filtered_nodes)
    }
   
    return (
        <TextField label="Search"
            className='w-100 my-3 me-3'
            size="small"
            onChange={(event) => search(event.target.value)}/>
    )
}

export default SearchGlob