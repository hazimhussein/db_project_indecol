import { TextField, Button, FormControl } from "@mui/material"
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import { addTableRow, updateTableRow } from "../../utils/api";
import { useSelector } from 'react-redux';
import { dataData, authedUser } from '../../reducers/data';
import { useState } from "react";
import SelectSearch from "./elements/selectSearch";

  const type_list = [
    ['','None'],
    ['University','University'],
    ['Private sector','Private sector'],
    ['Industry', 'Industry']
]
  const name_list = [
    ['sintef','Sintef'],
    ['TK','Trondheim Kommune'],
    ['PUCP','Pontificia Universidad Católica del Perú'],
    ['ETH', 'ETH Zürich'],
    ['SUA', 'Sokoine University of Agriculture'],
    ['Government of the Netherlands', 'Government of the Netherlands'],
    ['Leiden University', 'Leiden University'],
    ['APRI', 'Africa Prolicy Research Institute'],
    ['WU', 'Vienna University of Economics and Business'],
    ['SGS', 'SGS']
]

  
function PartnerForm({setData, data, child}){
    let dispatch = useDispatch();
    let list = useSelector(dataData)
    const current_user = useSelector(authedUser)
    
    let users = list["user"] ? list["user"].filter(user=>user.id!=current_user.id) : []
    
    let options_dict = {
      user:data?data.users.filter(user=>user.id!=current_user.id).map(user=>user.id):[],
      type:data?data.type:"",
      name:data?data.name:"",
    }

    const [options, setOptions] = useState(options_dict)

    const handleSave = () => {
        let cols = ["description", "url"]
        let userIds = [...options.user]
        if (~userIds.includes(current_user.id)){
          userIds.push(current_user.id)
        }
        let entry = {}
        for (let col of cols){
            entry[col] = document.getElementById(col).value
        }
        entry["name"] = options.name
        entry["type"] = options.type
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

export default PartnerForm