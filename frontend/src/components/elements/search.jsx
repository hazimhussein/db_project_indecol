import { TextField } from "@mui/material"

function SearchGlob({ modifiedNodes, setModifiedNodes }){
    
    const search = (val) => {
        let filtered_nodes = modifiedNodes.filter((node)=>{
            if (node.search || val == ""){
                return true
              }
            for (const [key, value] of Object.entries(node)){
                if (value != "" && typeof value == "string"){
                  if (value.toLowerCase().includes(val.toLowerCase())){
                    return true
                  }
                } else if (typeof value == "object"){
                    if (value && value.constructor == Array){
                        for (const entry of value){
                            for (const [k, v] of Object.entries(entry)){
                                if (v && typeof v == "object"){
                                    for (const [key_c, val_c] of Object.entries(v)){
                                        if (typeof val_c == "string" && val_c.toLowerCase().includes(val.toLowerCase())){
                                            return true
                                        }
                                    }
                                  }
                                if (typeof v == "string" && v.toLowerCase().includes(val.toLowerCase())){
                                    return true
                                  }
                            }
                        }
                    } else if (value) {
                        for (const [k, v] of Object.entries(value)){
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