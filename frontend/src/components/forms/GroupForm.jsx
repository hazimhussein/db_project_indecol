import { TextField, Button, FormControl, Modal, Box, Typography } from "@mui/material"
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import { addTableRow, updateTableRow } from "../../utils/api";
import { useSelector } from 'react-redux';
import { dataData, authedUser } from '../../reducers/data';
import { useState } from "react";
import dayjs from 'dayjs';
import PersonForm from "./PersonForm";
import SelectSearch from "./elements/selectSearch";

import {DatePicker} from "@mui/x-date-pickers"

const name_list = [
  ['Cherubini Group','Francesco Cherubini Group'],
  ['Verones Group','Francesca Verones Group'],
  ['Strømman Group','Anders Strømman Group'],
  ['Hertwich Group', 'Edgar Hertwich Group'],
  ['Müller Group', 'Daniel Müller Group'],
  ['Pettersen Group', 'Johan Pettersen Group'],
  ['Ottelin Group', 'Juudit Ottelin Groupy'],
  ['IEDL Group', 'Konstantin Stadler Group']
]
  
function GroupForm({setData, data, child}){
    let dispatch = useDispatch();
    let list = useSelector(dataData)
    const current_user = useSelector(authedUser)
    
    let users = list["user"] ? list["user"].filter(user=>user.id!=current_user.id) : []
    let persons = list["person"] ? list["person"] : []

    let options_dict = {
      user:data?data.users.filter(user=>user.id!=current_user.id).map(user=>user.id):[],
      name:data?data.name:"",
      person:data?data.persons.map(person=>person.id):[],
      start_date:data?dayjs(data.start_date):"",
      end_date:data?dayjs(data.end_date):""
    }

    const [options, setOptions] = useState(options_dict)

    const handleSave = () => {
        let userIds = [...options.user]
        if (~userIds.includes(current_user.id)){
          userIds.push(current_user.id)
        }
        let entry = {}
        entry["name"] = options.name
        entry["start_date"] = `${options.start_date.$y}-${options.start_date.$M}-${options.start_date.$D}`
        entry["end_date"] = `${options.end_date.$y}-${options.end_date.$M}-${options.end_date.$D}`
        entry["persons"] = options.person
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
        <TextField
            label="Name"
            id="name"
            className='my-2'
            value={options.name}
            onChange={(e)=>setOptions({...options, name:e.target.value})}
            autoFocus
            required
          />
        <Form.Label htmlFor="name">or choose...</Form.Label>
        <SelectSearch table="name" add={false} multi={false} list={true}
          options={options} setOptions={setOptions} 
          data={name_list}/>
      </FormControl>

      <DatePicker 
          label="Start Date"
          format="YYYY-MM-DD"
          inputFormat="YYYY-MM-DD"
          value={options.start_date}
          onChange={(e)=>setOptions({...options, start_date: e.target.value})}
          id="start_date" 
          className="my-2">
            {data && data.start_date}
            </DatePicker>
            <DatePicker 
          label="End Date"
          format="YYYY-MM-DD"
          inputFormat="YYYY-MM-DD"
          value={options.end_date}
          onChange={(e)=>setOptions({...options, end_date: e.target.value})}
          id="end_date" 
          className="my-2">
            {data && data.end_date}
            </DatePicker>

            <FormControl className="py-2 w-100">

          <SelectSearch table="person" add={child ? false : true} multi={true} 
              options={options} setOptions={setOptions} 
              data={persons} parameter={["first_name", "last_name"]}
              setModalOpened={setModalOpened}/>

            <Form.Text muted>
            Add people who are part of this Project
          </Form.Text>
          </FormControl>
      <FormControl className="py-2 w-100">
          <SelectSearch table="user" add={false} multi={true} 
          options={options} setOptions={setOptions} 
          data={users} parameter={["first_name", "last_name"]}/>
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