import { TextField, Button, MenuItem, FormControl, InputLabel, OutlinedInput, Select, Modal, Box, Typography } from "@mui/material"
import { useTheme } from '@mui/material/styles';
import TextArea from "./TextArea"
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import { addTableRow, updateTableRow, getTableData } from "../../utils/api";
import { useSelector } from 'react-redux';
import { dataData, authedUser } from '../../reducers/data';
import { useState } from "react";
import { Col } from "react-bootstrap";
import { Option, MultiSelect } from "./Select";
import dayjs from 'dayjs';
import PersonForm from "./PersonForm";
import { FaPlusSquare } from 'react-icons/fa';

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

  
function GroupForm({setData, data, child}){
    let dispatch = useDispatch();
    const theme = useTheme();
    const [userId, setUsersId] = useState(data?data.users.map(user=>user.id):[]);
    const [personId, setPersonsId] = useState(data?data.persons.map(person=>person.id):[]);
    const [name, setName] = useState(data?data.name:"Cherubini Group");
    const [startDate, setStartDate] = useState(data?dayjs(data.start_date):"");
    const [endDate, setEndDate] = useState(data?dayjs(data.end_date):"");
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
        } else if (event.target.name == "persons"){
            let val = typeof value === 'string' ? value.split(',') : value
            setPersonsId(val)
        }
    }; 

    let list = useSelector(dataData)
    let users = list["user"] ? list["user"] : []
    let persons = list["person"] ? list["person"] : []
    const current_user = useSelector(authedUser)

    const handleSave = () => {
        let userIds = [...userId]
        if (~userIds.includes(current_user.id)){
          userIds.push(current_user.id)
        }
        let entry = {}
        entry["name"] = name
        entry["start_date"] = `${startDate.$y}-${startDate.$M}-${startDate.$D}`
        entry["end_date"] = `${endDate.$y}-${endDate.$M}-${endDate.$D}`
        entry["persons"] = personId
        entry["users"] = userIds
        let param = {table:"group", row: entry}
        
        if (data == null){
            dispatch(addTableRow(param))
            .then((res)=>{
                console.log(res)
                setData({nodes: [...list["group"], res.payload.data]})})
           
        } else {
            dispatch(updateTableRow({table:"group", row: entry, rowId: data.id}))
            .then((res)=>{setData({nodes: [...list["group"].filter(row=>row.id!=data.id), res.payload.data]});
            })

            
        }
      };

      // Modal
      const [modalOpened, setModalOpened] = useState(false);

    return (
        <>
        <Modal open={modalOpened} onClose={() => setModalOpened(false)}>
        <Box
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            padding: '10px',
          }}
          className="d-flex flex-column"
        >
          
            <Typography variant="h6" component="h2">
              Add a new person record ...
            </Typography>
            <PersonForm setData={setData} child={true}/>
            
            <Button variant="outlined" onClick={()=>setModalOpened(false)}>
            Cancel
          </Button>
        </Box>
      </Modal>
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
            <MenuItem value="Cherubini Group">Francesco Cherubini Group</MenuItem>
            <MenuItem value="Verones Group">Francesca Verones Group</MenuItem>
            <MenuItem value="Strømman Group">Anders Strømman Group</MenuItem>
            <MenuItem value="Hertwich Group">Edgar Hertwich Group</MenuItem>
            <MenuItem value="Müller Group">Daniel Müller Group</MenuItem>
            <MenuItem value="Pettersen Group">Johan Pettersen Group</MenuItem>
            <MenuItem value="Ottelin Group">Juudit Ottelin Group</MenuItem>
            <MenuItem value="IEDL Group">Konstantin Stadler Group</MenuItem>
        </Select>
      </FormControl>
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
        <Form.Group>
        <InputLabel id="personsLabel">Persons</InputLabel>
        <Select
          labelId="personsLabel"
          id="persons"
          name="persons"
          style={{width:"85%"}}
          multiple
          defaultValue={personId}
          onChange={handleChange}
          input={<OutlinedInput label="Persons" />}
          MenuProps={MenuProps}
        >
          {persons.map((person) => (
            <MenuItem
              key={person.id}
              value={person.id}
              style={getStyles(person.id, personId, theme)}
            >
              {`${person.first_name} ${person.last_name}`}
            </MenuItem>
          ))}
        </Select>
        <button className="h1 btn-success d-inline-flex align-items-end position-absolute rounded m-0 mt-1 ms-4"
        onClick={()=>setModalOpened("person")}><FaPlusSquare /></button>
        </Form.Group>
        <Form.Text muted>
        Add people who are part of this group
      </Form.Text>
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
          {users.filter(user=>user.id!=current_user.id).map((user) => (
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
        <Button className="mt-5 mb-2" variant="contained" onClick={handleSave}>
            Save
          </Button>
        </>
        
    )
}

export default GroupForm