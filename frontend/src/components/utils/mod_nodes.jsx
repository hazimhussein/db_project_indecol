
import dayjs from "dayjs";
  

function modify_nodes(nodes, search){
  return nodes.filter((node) =>{
    if (node.search){
      return true
    }
    for (const [key, value] of Object.entries(search)){
      if (value != "" && typeof node[key] == "string"){
        if (key.toLowerCase().includes("date")) {
            let val = dayjs(node[key])
            if (value.start && val < value.start){
              return false
            }
            if (value.end && val > value.end){
              return false
            }
          } else if (!node[key].toLowerCase().includes(value.toLowerCase())){
            return false
          }
        } else if (typeof node[key] == "object"){
          if (node[key] && node[key].constructor == Array){
            let final_str = ""
              for (const entry of node[key]){
                  for (const [k, v] of Object.entries(entry)){
                      if (v && typeof v == "object"){
                          for (const [key_c, val_c] of Object.entries(v)){
                              if (typeof val_c == "string"){
                                  final_str += val_c
                              }
                          }
                        }
                      else if (typeof v == "string"){
                          final_str += v
                        }
                  }
              }
              if (!final_str.toLowerCase().includes(value.toLowerCase())){
                return false
              }
          } else if (node[key]) {
            let final_str = ""
              for (const [k, v] of Object.entries(node[key])){
                  if (typeof v == "string"){
                      final_str += v
                    }
              }
              if (!final_str.toLowerCase().includes(value.toLowerCase())){
                return false
              }
          }
      }
    }
    return  true
  }
   );
}

export default modify_nodes