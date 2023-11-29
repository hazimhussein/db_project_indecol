import { TextField, Button, FormControl } from "@mui/material"
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import { addTableRow, updateTableRow } from "../../utils/api";
import { useSelector } from 'react-redux';
import { dataData, authedUser } from '../../reducers/data';
import { useState } from "react";
import SelectSearch from "./elements/selectSearch";


  const type_list = [
    ['', 'None'],
    ['Software','Software'],
    ['Article','Article'],
    ['Website','Website'],
    ['Report', 'Report'],
    ['Repo','Repo']
]

  
function ResourceForm({setData, data, child}){
    let dispatch = useDispatch();
    let list = useSelector(dataData)
    const current_user = useSelector(authedUser)

    let users = list["user"] ? list["user"].filter(user=>user.id!=current_user.id)  : []

    let options_dict = {
      user:data?data.users.filter(user=>user.id!=current_user.id).map(user=>user.id):[],
      type:data?data.type:''
    }

    const [options, setOptions] = useState(options_dict)

    const handleSave = () => {
        let cols = ["description", "location"]
        let userIds = [...options.user]
        if (~userIds.includes(current_user.id)){
          userIds.push(current_user.id)
        }

        let entry = {}
        for (let col of cols){
            entry[col] = document.getElementById(col).value
        }
        entry["full_name"] = document.getElementById("name").value
        entry["type"] = options.type
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

        <SelectSearch table="type" add={false} multi={false} list={true}
          options={options} setOptions={setOptions} 
          data={type_list}/>

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

export default ResourceForm