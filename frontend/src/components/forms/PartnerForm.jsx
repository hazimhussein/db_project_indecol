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

  
function PartnerForm({setData, data, child, setModifiedNodes}){
    let dispatch = useDispatch();
    let list = useSelector(dataData)
    const current_user = useSelector(authedUser)
    
    let users = list["user"] ? list["user"].filter(user=>user.id!=current_user.id) : []
    
    let options_dict = {
      url:data?data.url:"",
      description:data?data.description:"",
      user:data?data.users.filter(user=>user.id!=current_user.id).map(user=>user.id):[],
      type:data?data.type:"",
      name:data?data.name:"",
    }

    const [options, setOptions] = useState(options_dict)

    let invalid_dict = { name: false, description: false, url: false, type: false }

    const [invalid, setInvalid] = useState(invalid_dict)
    const [formState, setFormState] = useState("")

    const handleSave = () => {
        let userIds = [...options.user]
        if (~userIds.includes(current_user.id)){
          userIds.push(current_user.id)
        }
        let entry = {}
        entry["url"] = options.url
        entry["description"] = options.description
        entry["name"] = options.name
        entry["type"] = options.type
        entry["users"] = userIds
        let param = {table:"partner", row: entry}
        
        if (data == null){
            dispatch(addTableRow(param))
            .then((res)=>{
              if (res.error){
                Object.keys(invalid).map(key=>{
                  if (Object.keys(res.payload).includes(key)){
                    setInvalid(prev=>({...prev, [key]: res.payload[key]}))
                  } else {
                    setInvalid(prev=>({...prev, [key]: false}))
                  }
                })
                setFormState("fail")
            } else {
              Object.keys(invalid).map(key=>{
                  setInvalid(prev=>({...prev, [key]: false}))
              })
              setFormState("success")
              if (!child){
                setData({nodes: [...list["partner"], res.payload.data]})
                setModifiedNodes([...list["partner"], res.payload.data])
              }
            }
                })
           
        } else {
            dispatch(updateTableRow({table:"partner", row: entry, rowId: data.id}))
            .then((res)=>{
              if (res.error){
                Object.keys(invalid).map(key=>{
                  if (Object.keys(res.payload).includes(key)){
                    setInvalid(prev=>({...prev, [key]: res.payload[key]}))
                  } else {
                    setInvalid(prev=>({...prev, [key]: false}))
                  }
                })
                setFormState("fail")
            } else {
              Object.keys(invalid).map(key=>{
                setInvalid(prev=>({...prev, [key]: false}))
            })
              setFormState("success")
              setData({nodes: [...list["partner"].filter(row=>row.id!=data.id), res.payload.data]});
              setModifiedNodes([...list["partner"].filter(row=>row.id!=data.id), res.payload.data])
            }
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
            error = {invalid.name && true}
          />
        <Form.Label htmlFor="name">or choose...</Form.Label>
        <SelectSearch table="name" add={false} multi={false} list={true}
          options={options} setOptions={setOptions} 
          data={name_list}
          error = {invalid.name && true}/>
          {invalid.name && <p className={`text-danger small m-0 mb-2`} style={{textAlign:"left"}}>{invalid.name}</p>}
      </FormControl>

          <Form.Label htmlFor="description">Description</Form.Label>
          <textarea id="description" 
          className={`form-control px-3 ${invalid.description && "border-danger"}`} 
          name="description" 
          minLength={10} 
          onChange={(e)=>setOptions({...options, description:e.target.value})}
          defaultValue={options.description} placeholder={options.description}/>
          {invalid.description && <p className={`text-danger small m-0 mb-2`} style={{textAlign:"left"}}>{invalid.description}</p>}

          <TextField
            label="URL"
            id="url"
            className='my-2'
            onChange={(e)=>setOptions({...options, url:e.target.value})}
            defaultValue={options.url} error = {invalid.url && true}
            />
            {invalid.url && <p className={`text-danger small m-0 mb-2`} style={{textAlign:"left"}}>{invalid.url}</p>}
  

        <SelectSearch table="type" add={false} multi={false} list={true}
          options={options} setOptions={setOptions} 
          data={type_list}  error={invalid.type && true}/>
          {invalid.type && <p className={`text-danger small m-0 mb-2`} style={{textAlign:"left"}}>{invalid.type}</p>}

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
          {formState != "" &&
                <p className={`${formState=="fail" ?"text-danger": "text-success"} small`} style={{textAlign:"left"}}>
              {formState=="fail" ? `${data==null? "Adding": "Updating"} record failed, please confirm your inputs are in correct format and you have filled all required fields`
              :`${data==null? "Adding": "Updating"} record succeeded`}
            </p>}
        </>
        
    )
}

export default PartnerForm