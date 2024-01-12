import { TextField, MenuItem, FormControl, InputLabel, OutlinedInput, Select, ListSubheader } from "@mui/material"
import Form from 'react-bootstrap/Form';
import { useTheme } from '@mui/material/styles';
import { capitalizeFirstLetter } from "../../utils/helpers";
import { useState, useRef } from "react";
import { FaPlusSquare } from 'react-icons/fa';


function getStyles(name, id, theme) {
  let check = id 
  ? (typeof id != "object" ? id == name : id.indexOf(name) !== -1)
  : false
    return {
      fontWeight:
        !check
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    autoFocus:false,
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

function SelectSearch({table, add, field, options, setOptions, data, parameter, setModalOpened, multi, list, error, filter_id}){
    const theme = useTheme();

    const [filter, setFilter] = useState("")
    let inputRef = useRef(undefined);

    let choice_list = data.map(val=>
    field.val.name == "project" 
    ? {id: val.id, name: val["project_id"]}
    : (field.val.name == "person" || field.val.name == "user")
    ? {id: val.id, name: `${val["first_name"]} ${val["last_name"]}`}
    : {id: val.id, name: val[Object.keys(val).filter(k=>k.includes("name"))[0]]})

    choice_list = choice_list.map(entry=>
      typeof entry.name == "object"
      ? {id: entry.id, name: entry.name[Object.keys(entry.name).filter(k=>k.includes("name"))[0]]}
      : entry )

    let add_option = field.val.name != "fieldoptions" && field.val.name != "user" && field.val.name != table

    return (
        <FormControl className="py-2 w-100">
      <Form.Group>
        <InputLabel required={field.val.name != "user" ? field.val.required : false} id={`${field.key}sLabel`}>{field.val.label}</InputLabel>
        <Select
          labelId={`${field.key}sLabel`}
          id={`${field.key}`}
          name={`${field.key}`}
          style={add_option ? {width:"85%"} : {width:"100%"}}
          multiple = {field.val.type.includes("many")}
          value={options[field.key]}
          onChange={(e)=>setOptions({...options, [field.key]: e.target.value})}
          input={<OutlinedInput label={`${capitalizeFirstLetter(field.val.label)}s`} />}
          MenuProps={MenuProps}
          renderValue={() => choice_list.filter(val=> field.val.type.includes("many")  
                    ? options[field.key].includes(val.id)
                    : options[field.key] == val.id ).map(val=>val.name)
                    .join(field.val.type.includes("many")  ? ", " : "")}
        onAnimationEnd={() => inputRef.current && inputRef.current.focus()}
        onClick={()=> inputRef.current && inputRef.current.focus()}
        error={error}
        >
          <ListSubheader> 
              <TextField
              size="small"
              autoFocus
              placeholder="Search"
              fullWidth
              inputRef={inputRef}
              defaultValue={filter}
              onChange={(event) => setFilter(event.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Escape") {
                  // Prevents autoselecting item while typing (default Select behaviour)
                  e.stopPropagation();
                }
              }}
          /></ListSubheader>
          { choice_list.filter(val=>val.name.toLowerCase().includes(filter.toLowerCase())).map((val) => (
            <MenuItem
              key={val.id}
              value={val.id}
              style={getStyles(val.id, options[field.key], theme)}
            >
              {val.name}
            </MenuItem>
          ))}
        </Select>
        {add_option && <button className="h1 btn-success d-inline-flex align-items-end position-absolute rounded m-0 mt-1 ms-4"
        onClick={()=>setModalOpened(field.val.name)}><FaPlusSquare /></button>}
        </Form.Group>
      </FormControl>
    )
}

export default SelectSearch