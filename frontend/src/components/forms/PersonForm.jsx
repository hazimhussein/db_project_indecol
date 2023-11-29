import { TextField, Button, FormControl } from "@mui/material"
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import { addTableRow, updateTableRow } from "../../utils/api";
import { useSelector } from 'react-redux';
import { dataData, authedUser } from '../../reducers/data';
import { useState } from "react";
import dayjs from 'dayjs';
import SelectSearch from "./elements/selectSearch";

import {DatePicker} from "@mui/x-date-pickers"

  const role_list = [
    ['Master Student','Master Student'],
    ['PhD','PhD'],
    ['PostDoc','PostDoc'],
    ['Engineer', 'Engineer'],
    ['Associate Professor', 'Associate Professor'],
    ['Researcher', 'Researcher'],
    ['Professor','Professor']
]
  
function PersonForm({setData, data, child}){
    let dispatch = useDispatch();
    let list = useSelector(dataData)
    const current_user = useSelector(authedUser)

    let users = list["user"] ? list["user"].filter(user=>user.id!=current_user.id) : []

    let options_dict = {
      user:data?data.users.filter(user=>user.id!=current_user.id).map(user=>user.id):[],
      role:data?data.role:"Master Student",
      start_date:data?dayjs(data.start_date):"",
      end_date:data?dayjs(data.end_date):""
    }

    const [options, setOptions] = useState(options_dict)


    const [userId, setUsersId] = useState(data?data.users.map(user=>user.id):[]);
    const [role, setRole] = useState(data?data.role:"PhD");
    const [startDate, setStartDate] = useState(data?dayjs(data.start_date):"");
    const [endDate, setEndDate] = useState(data?dayjs(data.end_date):"");
        

    const handleSave = () => {
        let cols = ["first_name", "middle_name", "last_name"]
        let userIds = [...options.user]
        if (~userIds.includes(current_user.id)){
          userIds.push(current_user.id)
        }
        let entry = {}
        for (let col of cols){
            entry[col] = document.getElementById(col).value
        }
        entry["start_date"] = `${options.start_date.$y}-${options.start_date.$M}-${options.start_date.$D}`
        entry["end_date"] = `${options.end_date.$y}-${options.end_date.$M}-${options.end_date.$D}`
        entry["role"] = options.role
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
        
        <SelectSearch table="role" add={false} multi={false} list={true}
          options={options} setOptions={setOptions} 
          data={role_list}/>

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

export default PersonForm