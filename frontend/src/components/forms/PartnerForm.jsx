import { TextField, Button, MenuItem, FormControl, InputLabel, OutlinedInput, Select } from "@mui/material"
import { useTheme } from '@mui/material/styles';
import TextArea from "./TextArea"
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import { addTableRow, updateTableRow, getTableData } from "../../utils/api";
import { useSelector } from 'react-redux';
import { dataData } from '../../reducers/data';
import { useState } from "react";
import { Col } from "react-bootstrap";
import { Option, MultiSelect } from "./Select";

import {DatePicker} from "@mui/x-date-pickers"

function getStyles(name, userId, theme) {
    return {
      fontWeight:
        userId.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  
function PartnerForm({setData, data}){
    let dispatch = useDispatch();
    const theme = useTheme();
    const [userId, setUsersId] = useState(data?data.users.map(user=>user.id):[]);
    const [name, setName] = useState(data?data.name:"sintef");
    const [type, setTypes] = useState(data?data.type:[]);

    const handleChange = (event) => {
        const {
        target: { value },
        } = event;
        console.log(event)
        if(event.target.name == "name"){
            setName(value)
        } else if (event.target.name == "users"){
            let val = typeof value === 'string' ? value.split(',') : value
            setUsersId(val)
        } else if(event.target.name == "type"){
            setTypes(value)
        }
    }; 

    let list = useSelector(dataData)
    let users = list["user"] ? list["user"] : []
    const current_user = 1

    const handleSave = () => {
        let cols = ["description", "url"]
        let userIds = [...userId]
        userIds.push(current_user)
        let entry = {}
        for (let col of cols){
            entry[col] = document.getElementById(col).value
        }
        entry["name"] = name
        entry["type"] = type
        entry["users"] = userIds
        let param = {table:"partner", row: entry}
        
        if (data == null){
            dispatch(addTableRow(param))
            .then((res)=>{
                console.log(res)
                setData({nodes: [...list["partner"], res.payload.data]})})
           
        } else {
            dispatch(updateTableRow({table:"partner", row: entry, rowId: data.id}))
            .then((res)=>{setData({nodes: [...list["partner"].filter(row=>row.id!=data.id), res.payload.data]});
            })

            
        }
            
        
        
      };

    return (
        <>
        <FormControl className="py-2 w-100">
        <InputLabel id="nameLabel">Name</InputLabel>
        <Select
          labelId="nameLabel"
          id="name"
          name="name"
          defaultValue={name}
          onChange={handleChange}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
          autoFocus
          required
        >
            <MenuItem value="sintef">Sintef</MenuItem>
            <MenuItem value="equinor">Equinor</MenuItem>
            <MenuItem value="TK">Trondheim Kommune</MenuItem>
            <MenuItem value="PUCP">Pontificia Universidad Católica del Perú</MenuItem>
            <MenuItem value="ETH">ETH Zürich</MenuItem>
            <MenuItem value="SUA">Sokoine University of Agriculture</MenuItem>
            <MenuItem value="Government of the Netherlands">Government of the Netherlands</MenuItem>
            <MenuItem value="Leiden University">Leiden University</MenuItem>
            <MenuItem value="APRI">Africa Prolicy Research Institute</MenuItem>
            <MenuItem value="WU">Vienna University of Economics and Business</MenuItem>
            <MenuItem value="SGS">SGS</MenuItem>
        </Select>
      </FormControl>
          <Form.Label htmlFor="description">Description</Form.Label>
          <textarea id="description" 
          className="form-control px-3" 
          name="description" 
          minLength={10} 
          defaultValue={data && data.description} placeholder={data && data.description}/>
          <TextField
            label="URL"
            id="url"
            className='my-2'
            defaultValue={data && data.url}
          />
        <FormControl className="py-2 w-100">
        <InputLabel id="typeLabel">Type</InputLabel>
        <Select
          labelId="typeLabel"
          id="type"
          name="type"
          defaultValue={type}
          onChange={handleChange}
          input={<OutlinedInput label="Type" />}
          MenuProps={MenuProps}
        >
            <MenuItem value="" style={getStyles(3, userId, theme)}>----</MenuItem>
            <MenuItem value="University" style={getStyles(3, userId, theme)}>University</MenuItem>
            <MenuItem value="Private sector" style={getStyles(3, userId, theme)}>Private sector</MenuItem>
            <MenuItem value="Industry" style={getStyles(3, userId, theme)}>Industry</MenuItem>
        </Select>
      </FormControl>

        <FormControl className="py-2 w-100">
        <InputLabel id="usersLabel">Users</InputLabel>
        <Select
          labelId="usersLabel"
          id="users"
          name="users"
          multiple
          defaultValue={userId}
          onChange={handleChange}
          input={<OutlinedInput label="Users" />}
          MenuProps={MenuProps}
        >
          {users.filter(user=>user.id!=current_user).map((user) => (
            <MenuItem
              key={user.id}
              value={user.id}
              style={getStyles(user.id, userId, theme)}
            >
              {user.username}
            </MenuItem>
          ))}
        </Select>
        <Form.Text muted>
        Add other people who you would like 
        to be able to edit this entry
      </Form.Text>
      </FormControl>
        <Button className="mt-5" variant="contained" onClick={handleSave}>
            Save
          </Button>
        </>
        
    )
}

export default PartnerForm