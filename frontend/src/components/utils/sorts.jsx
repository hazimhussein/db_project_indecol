function sort_cols(list_options, table){
    return Object.fromEntries(Object.entries(list_options[table]).map(([k, v]) => {
      if (v.type == "date" || v.type == "string" || v.type == "email"){
        return [k.toUpperCase(), (array) => array.sort((a, b) => 
           a[k] && b[k] 
           ? a[k].localeCompare(b[k], { sensitivity: "base" }) 
           : a[k] ? -1 : 1)]
      } else if (v.type == "integer") {
        return [k.toUpperCase(), (array) => array.sort((a, b) =>
          a[k] && b[k] 
           ? a[k] - b[k]
           : a[k] ? -1 : 1)]
      } else if (v.type == "boolean") {
        return [k.toUpperCase(), (array) => array.sort((a, b) =>
          a[k] === b[k] 
           ? 0
           : a[k] ? -1 : 1)]
      } else if (v.type == "foreign_key") {
        return [k.toUpperCase(), (array) => array.sort((a, b) => {
          let name_fields = Object.keys(list_options[v.name]).filter(col => col.includes("name"))
          if (name_fields.length > 0){
              let name_field =  name_fields.includes("last_name") ? "last_name" : name_fields.slice(0,1)
              return a[k] && b[k] 
              ? a[k][name_field].localeCompare(b[k][name_field], { sensitivity: "base" }) 
              : a[k] ? -1 : 1
          }
          })]
      } else if (v.type == "foreign_key_many") {
        return [k.toUpperCase(), (array) => array.sort((a, b) => {
          let name_fields = Object.keys(list_options[v.name]).filter(col => col.includes("name"))
          if (name_fields.length > 0){
              let name_field =  name_fields.includes("last_name") ? "last_name" : name_fields.slice(0,1)
              return a[k].length > 0 && b[k].length > 0 
              ? a[k][0][name_field].localeCompare(b[k][0][name_field], { sensitivity: "base" }) 
              : a[k].length > 0 ? -1 : 1
          }
          })]
      } else {
        return []
      }
     })) 
}

export default sort_cols