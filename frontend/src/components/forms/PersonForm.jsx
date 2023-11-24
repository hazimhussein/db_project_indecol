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
import dayjs from 'dayjs';

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

  
function PersonForm({setData, data}){
    let dispatch = useDispatch();
    const theme = useTheme();
    const [userId, setUsersId] = useState(data?data.users.map(user=>user.id):[]);
    const [role, setRole] = useState(data?data.role:"PhD");
    const [startDate, setStartDate] = useState(data?dayjs(data.start_date):"");
    const [endDate, setEndDate] = useState(data?dayjs(data.end_date):"");
    const handleChange = (event) => {
        const {
        target: { value },
        } = event;
        console.log(event)
        if(event.target.name == "role"){
            setRole(value)
        } else if (event.target.name == "users"){
            let val = typeof value === 'string' ? value.split(',') : value
            setUsersId(val)
        }
    }; 

    let list = useSelector(dataData)
    let users = list["user"] ? list["user"] : []
    const current_user = 1

    const handleSave = () => {
        let cols = ["first_name", "middle_name", "last_name"]
        let userIds = [...userId]
        userIds.push(current_user)
        let entry = {}
        for (let col of cols){
            entry[col] = document.getElementById(col).value
        }
        entry["start_date"] = `${startDate.$y}-${startDate.$M}-${startDate.$D}`
        entry["end_date"] = `${endDate.$y}-${endDate.$M}-${endDate.$D}`
        entry["role"] = role
        entry["users"] = userIds
        let param = {table:"person", row: entry}
        
        if (data == null){
            dispatch(addTableRow(param))
            .then((res)=>{
                console.log(res)
                setData({nodes: [...list["person"], res.payload.data]})})
           
        } else {
            dispatch(updateTableRow({table:"person", row: entry, rowId: data.id}))
            .then((res)=>{setData({nodes: [...list["person"].filter(row=>row.id!=data.id), res.payload.data]});
            })

            
        }
      };

    return (
        <>
        <TextField
            label="Firt Name"
            id="first_name"
            className='my-2'
            defaultValue={data && data.first_name}
            autoFocus
            required
          />
        <TextField
            label="Middle Name"
            id="middle_name"
            className='my-2'
            defaultValue={data && data.middle_name}
          />
        <TextField
            label="Last Name"
            id="last_name"
            className='my-2'
            defaultValue={data && data.last_name}
            required
          />
          <DatePicker 
          label="Start Date"
          format="YYYY-MM-DD"
          inputFormat="YYYY-MM-DD"
          value={startDate}
          onChange={(newValue) => setStartDate(newValue)} 
          id="start_date" 
          className="my-2">
            {data && data.start_date}
            </DatePicker>
            <DatePicker 
          label="End Date"
          format="YYYY-MM-DD"
          inputFormat="YYYY-MM-DD"
          value={endDate}
          onChange={(newValue) => setEndDate(newValue)} 
          id="end_date" 
          className="my-2">
            {data && data.end_date}
            </DatePicker>
          
        <FormControl className="py-2 w-100">
        <InputLabel id="roleLabel">Role</InputLabel>
        <Select
          labelId="roleLabel"
          id="role"
          name="role"
          defaultValue={role}
          onChange={handleChange}
          input={<OutlinedInput label="Role" />}
          MenuProps={MenuProps}
        >
            <MenuItem value="Master Student">Master Student</MenuItem>
            <MenuItem value="PhD">PhD</MenuItem>
            <MenuItem value="PostDoc">PostDoc</MenuItem>
            <MenuItem value="Engineer">Engineer</MenuItem>
            <MenuItem value="Associate Professor">Associate Professor</MenuItem>
            <MenuItem value="Researcher">Researcher</MenuItem>
            <MenuItem value="Professor">Professor</MenuItem>
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

export default PersonForm