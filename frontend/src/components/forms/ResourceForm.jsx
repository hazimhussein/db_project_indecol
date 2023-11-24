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

  
function ResourceForm({setData, data}){
    let dispatch = useDispatch();
    const theme = useTheme();
    const [userId, setUsersId] = useState(data?data.users.map(user=>user.id):[]);
    const [type, setTypes] = useState(data?data.type:[]);

    const handleChange = (event) => {
        const {
        target: { value },
        } = event;
        console.log(event)
        if(event.target.name == "type"){
            setTypes(value)
        } else if (event.target.name == "users"){
            let val = typeof value === 'string' ? value.split(',') : value
            setUsersId(val)
        }
    }; 

    let list = useSelector(dataData)
    let users = list["user"] ? list["user"] : []
    const current_user = 1

    const handleSave = () => {
        let cols = ["description", "location"]
        let userIds = [...userId]
        userIds.push(current_user)
        let entry = {}
        for (let col of cols){
            entry[col] = document.getElementById(col).value
        }
        entry["full_name"] = document.getElementById("name").value
        entry["type"] = type
        entry["users"] = userIds
        let param = {table:"resource", row: entry}
        
        if (data == null){
            dispatch(addTableRow(param))
            .then((res)=>{
                console.log(res)
                setData({nodes: [...list["resource"], res.payload.data]})})
           
        } else {
            dispatch(updateTableRow({table:"resource", row: entry, rowId: data.id}))
            .then((res)=>{setData({nodes: [...list["resource"].filter(row=>row.id!=data.id), res.payload.data]});
            })

            
        }
            
        
        
      };

    return (
        <>
        <TextField
            label="Name"
            id="name"
            className='my-2'
            defaultValue={data && data.full_name}
            autoFocus
            required
          />
          <Form.Label htmlFor="description">Description</Form.Label>
          <textarea id="description" 
          className="form-control px-3" 
          name="description" 
          minLength={10} 
          defaultValue={data && data.description} placeholder={data && data.description}/>
          <TextField
            label="Location"
            id="location"
            className='my-2'
            defaultValue={data && data.location}
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
            <MenuItem value="Software" style={getStyles(3, userId, theme)}>Software</MenuItem>
            <MenuItem value="Article" style={getStyles(3, userId, theme)}>Article</MenuItem>
            <MenuItem value="Website" style={getStyles(3, userId, theme)}>Website</MenuItem>
            <MenuItem value="Report" style={getStyles(3, userId, theme)}>Report</MenuItem>
            <MenuItem value="Repo" style={getStyles(3, userId, theme)}>Repo</MenuItem>
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
              {`${user.first_name} ${user.last_name}`}
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

export default ResourceForm