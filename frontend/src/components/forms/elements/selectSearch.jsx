import { TextField, MenuItem, FormControl, InputLabel, OutlinedInput, Select, ListSubheader } from "@mui/material"
import Form from 'react-bootstrap/Form';
import { useTheme } from '@mui/material/styles';
import { capitalizeFirstLetter } from "../../../utils/helpers";
import { useState } from "react";
import { FaPlusSquare } from 'react-icons/fa';


function getStyles(name, id, theme) {
    return {
      fontWeight:
        id.indexOf(name) === -1
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

function SelectSearch({table, add, options, setOptions, data, parameter, setModalOpened, multi, list}){
    const theme = useTheme();

    //Filter
    const [filter, setFilter] = useState("")

    return (
        <FormControl className="py-2 w-100">
      <Form.Group>
        <InputLabel id={`${table}sLabel`}>{capitalizeFirstLetter(table)}</InputLabel>
        <Select
          labelId={`${table}sLabel`}
          id={`${table}s`}
          name={`${table}s`}
          style={add ? {width:"85%"} : {width:"100%"}}
          multiple = {multi}
          value={options[table]}
          onChange={(e)=>setOptions({...options, [table]: e.target.value})}
          input={<OutlinedInput label={`${capitalizeFirstLetter(table)}s`} />}
          MenuProps={MenuProps}
          renderValue={() => multi ? 
            !list ? data.filter(val=>options[table].includes(val.id)).map(val=>
                    typeof parameter == "string" 
                    ? val[parameter]
                    : parameter.map(param=> `${val[param]} `).join(" ")).join(", ")
            : options[table].join(", ")
        : options[table]}
        >
          <ListSubheader> 
              <TextField
              size="small"
              autoFocus
              placeholder="Search"
              fullWidth
              defaultValue={filter}
              onChange={(event) => setFilter(event.target.value)}
              onKeyDown={(e) => {
                if (e.key !== "Escape") {
                  // Prevents autoselecting item while typing (default Select behaviour)
                  e.stopPropagation();
                }
              }}
          /></ListSubheader>
          { !list ? data.filter(val=>(typeof parameter == "string" ? val[parameter]
            : `${parameter.map(param=> `${val[param]} `)}`).toLowerCase().includes(filter.toLowerCase())).map((val) => (
            <MenuItem
              key={val.id}
              value={val.id}
              style={getStyles(val.id, options[table], theme)}
            >
              {typeof parameter == "string" ? val[parameter]
            : parameter.map(param=> `${val[param]} `).join(" ")}
            </MenuItem>
          ))
        : data.filter(val=>(`${val[0]} ${val[1]}`).toLowerCase().includes(filter.toLowerCase())).map(val=><MenuItem key={val[0]} value={val[0]}>{val[1]}</MenuItem>)}
        </Select>
        {add && <button className="h1 btn-success d-inline-flex align-items-end position-absolute rounded m-0 mt-1 ms-4"
        onClick={()=>setModalOpened(table)}><FaPlusSquare /></button>}
        </Form.Group>
      </FormControl>
    )
}

export default SelectSearch