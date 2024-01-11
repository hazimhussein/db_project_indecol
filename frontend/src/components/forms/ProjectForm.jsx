import { TextField, Button, FormControl, Modal, Box, Typography } from "@mui/material"
import Form from 'react-bootstrap/Form';
import { useDispatch } from 'react-redux';
import { addTableRow, updateTableRow } from "../../utils/api";
import { useSelector } from 'react-redux';
import { dataData, authedUser, dataOptions } from '../../reducers/data';
import { useState } from "react";
import dayjs from 'dayjs';
import PersonForm from "./PersonForm";
import GroupForm from "./GroupForm";
import ResourceForm from "./ResourceForm";
import PartnerForm from "./PartnerForm";
import SelectSearch from "./elements/selectSearch";
import { capitalizeFirstLetter, order_dict } from "../../utils/helpers";


import {DatePicker} from "@mui/x-date-pickers"

// const keywords_list = [
//     ['circular economy','CIRCULAR ECONOMY'],
//     ['resources','RESOURCES'],
//     ['materials', 'MATERIALS'],
//     ['recycling', 'RECYCLING'],
//     ['environment', 'ENVIRONMENT'],  
//     ['ecosystems','ECOSYSTEMS'],
//     ['bioresources','BIORESOURCES'],
//     ['biodiversity', 'BIODIVERSITY'],
//     ['climate', 'CLIMATE'],
//     ['bioenergy', 'BIOENERGY'],  
//     ['food','FOOD'],
//     ['biomaterials','BIOMATERIALS'],
//     ['energy', 'ENERGY'],
//     ['transport', 'TRANSPORT'],
//     ['buildings', 'BUILDINGS'],  
//     ['pollution','POLLUTION'],
//     ['transformation pathways','TRANSFORMATION PATHWAYS'],
//     ['human settlement', 'HUMAN SETTLEMENT'],
//     ['Sustainable Production','SUSTAINABLE PRODUCTION' ],
//     ['Consumption','CONSUMPTION'],  
//     ['Production','PRODUCTION'],
//     ['trade','TRADE'],
//     ['economic growth','ECONOMIC GROWTH'],
//     ['sustainability', 'SUSTAINABILITY'],
//     ['exiobase', 'EXIOBASE'],
//     ['database', 'DATABASE']]

// const methods_list =[
//     ['lca','Life Cycle Assessment'],
//     ['eemrio','Environmentally Extended Multi-Regional Input-Output analysis'],
//     ['ia', 'Impact Assessment'],
//     ['mfa', 'Material Flow Analysis'],
//     ['sqlite','Sqlite']
// ]

// const type_list = [
//     ['Master Project','Master Project'],
//     ['PhD Project','PhD Project'],
//     ['PostDoc Project','PostDoc Project'],
//     ['Other type', 'Other type'],
//     ['European Project','European Project']
// ]


  
function ProjectForm({setData, data, table, child}){
    let dispatch = useDispatch();

    let list = useSelector(dataData)
    const current_user = useSelector(authedUser)
    let list_options = useSelector(dataOptions)[table]


    // let users = list["user"] ? list["user"].filter(user=>user.id!=current_user.id) : []
    // let persons = list["person"] ? list["person"] : []
    // let partners = list["partner"] ? list["partner"] : []
    // let groups = list["group"] ? list["group"] : []
    // let resources = list["resource"] ? list["resource"] : []
    // let projects = list["project"] ? list["project"] : []

    let options_dict = {}
    // {
    //   user:data?data.users.filter(user=>user.id!=current_user.id).map(user=>user.id):[],
    //   keyword:data?data.keywords.split(", "):[],
    //   method:data?data.methods.split(", "):[],
    //   type:data?data.type:"Master Project",
    //   person:data?data.persons.map(person=>person.id):[],
    //   group:data?data.groups.map(group=>group.id):[],
    //   partner:data && data.partners?data.partners.map(partner=>partner.id):[],
    //   resource:data && data.resources?data.resources.map(resource=>resource.id):[],
    //   project:data && data.related ?data.related.map(project=>project.id):[],
    //   start_date:data?dayjs(data.start_date):null,
    //   end_date:data?dayjs(data.end_date):null
    // }

    Object.entries(list_options).filter(([key, val]) => key != "id").map(([key, val])=>
      options_dict[key] = data && data[key]
      ? (key.includes("date")
      ? dayjs(data[key])
      : val.type.includes("many")
      ? data[key].map(v=>v.id)
      : val.type.includes("foreign_key")
      ? data[key].id
      : data[key]
      )
      :(
      //   key.includes("date")
      // ? null
      // :
       val.type.includes("many")
      ? []
      : undefined
      )
    )

    const [options, setOptions] = useState(options_dict)

    let invalid_dict = Object.fromEntries(Object.keys(list_options).filter(k=>k!="id").map(k=>[k, false]))
    // { project_id: false, name: false, description: false, start_date: false, keywords: false, methods: false, persons: false, groups: false}

    const [invalid, setInvalid] = useState(invalid_dict)
    const [formState, setFormState] = useState("")

    const handleSave = () => {
        // let cols = ["project_id", "name", "description"]
        let userIds = [...options.users]
        if (~userIds.includes(current_user.id)){
          userIds.push(current_user.id)
        }
        
        let entry = {}
        // for (let col of cols){
        //     entry[col] = document.getElementById(col).value
        // }
        Object.entries(options).map(([key, val])=>
          entry[key] = (key.includes("date") && val)
          ? dayjs(val).format("YYYY-MM-DD")
          : key == "users" 
          ? userIds
          : val
        )
        // entry["start_date"] = options.start_date ? dayjs(options.start_date).format("YYYY-MM-DD"): options.start_date
        // entry["end_date"] = options.end_date ? dayjs(options.end_date).format("YYYY-MM-DD") : options.end_date
        // entry["type"] = options.type
        // entry["keywords"] = typeof options.keyword != "string" ? options.keyword.join(", ") : options.keyword
        // entry["methods"] = typeof options.method != "string" ? options.method.join(", ") : options.method
        // entry["persons"] = options.person
        // entry["partners"] = options.partner
        // entry["groups"] = options.group
        // entry["resources"] = options.resource
        // entry["related"] = options.project
        // entry["users"] = userIds
        let param = {table:table, row: entry}

        
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
                setData([...list[table], res.payload.data])
              }
            }
                
              })
                
           
        } else {
            dispatch(updateTableRow({table:table, row: entry, rowId: data.id}))
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
              setData(res.payload.data);
            }
            
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
            backgroundColor: '#ffffff',
            border: '1px solid #e0e0e0',
            borderRadius: '4px',
            padding: '10px',
            height: '90%',
          }}
          className="d-flex flex-column"
        >
          {/* {modalOpened == "person"?
            <>
            <Typography variant="h6" component="h2">
              Add a new person record ...
            </Typography>
            <PersonForm setData={setData} child={true}/>
            </>
            : modalOpened == "group"?
            <>
            <Typography variant="h6" component="h2">
              Add a new group record ...
            </Typography>
            <GroupForm setData={setData} child={true}/>
            </>
            : modalOpened == "resource"?
            <>
            <Typography variant="h6" component="h2">
              Add a new resource record ...
            </Typography>
            <ResourceForm setData={setData} child={true}/>
            </>
            : modalOpened == "partner" &&
            <>
            <Typography variant="h6" component="h2">
              Add a new partner record ...
            </Typography>
            <PartnerForm setData={setData} child={true}/>
            </>} */}
            
            <Typography variant="h6" component="h2">
              Add a new {modalOpened} record ...
            </Typography>
            <ProjectForm setData={setData} child={true} table={modalOpened}/>
            <Button variant="outlined" onClick={()=>setModalOpened(false)}>
            Cancel
          </Button>
        </Box>
      </Modal>
      {
        order_dict(list_options, options_dict=true).filter(([key, val])=>key!="id").map(([key, val])=>{
          if (key.toLowerCase().includes("desc")){
            return (<FormControl key={key}>
              <Form.Label htmlFor={key}>{val.label}</Form.Label>
              <textarea id={key} 
              className={`form-control px-3 ${invalid.description && "border-danger"}`} 
              name={key} 
              minLength={10} 
              defaultValue={data && data[key]} placeholder={data && data[key]}
              onChange={(e)=>setOptions({...options, [key]: e.target.value})}/>
              {invalid[key] && <p className={`text-danger small m-0 mb-2`} style={{textAlign:"left"}}>{invalid[key]}</p>}
            </FormControl>)
          } else if (val.type == "string" || val.type == "integer"){
            return (<FormControl key={key}>
              <TextField
            label={val.label}
            id={key}
            className='my-2'
            defaultValue={data && data[key]}
            onChange={(e)=>setOptions({...options, [key]: e.target.value})}
            required={val.required}
            error = {invalid[key] && true}
          />
          {invalid[key] && <p className={`text-danger small m-0 mb-2`} style={{textAlign:"left"}}>{invalid[key]}</p>}
            </FormControl>)
          } else if (val.type == "date"){
            return (<FormControl key={key}>
              <DatePicker 
              label={`${val.label} ${val.required ? "*" : ""}`}
              format="YYYY-MM-DD"
              inputFormat="YYYY-MM-DD"
              value={options[key]}
              minDate={key.includes("end") ? options.start_date : undefined}
              onChange={(e)=>setOptions({...options, [key]: e})}
              id={key}
              className={`my-2`}
              error = {invalid[key] && true}>
                {data && data[key]}
                </DatePicker>
                {invalid[key] && <p className={`text-danger small m-0 mb-2`} style={{textAlign:"left"}}>{invalid[key]}</p>}
            </FormControl>)
          } else if (val.type.includes("foreign_key")){
            return (<FormControl key={key}>
              <SelectSearch table={table}
                field={{key:key, val:val}}
                options={options} setOptions={setOptions} 
                data={list[val.name].filter(v=>
                  val.name == "fieldoptions" ? (v.table == table && v.field == key)
                  :val.name == "user" ? v.id!=current_user.id
                  :val.name == table ? data ? v.id != data.id : true
                  : true)}
                setModalOpened={setModalOpened}
                error = {invalid[key] && true}/>
              {invalid[key] && <p className={`text-danger small m-0 mb-2`} style={{textAlign:"left"}}>{invalid.keywords}</p>}
              <Form.Text muted>
                {val.name == "user" ? "Add other people who you would like to be able to edit this entry"
              : val.name == "person" && `Add people who are part of this ${capitalizeFirstLetter(table)}`}
              </Form.Text>
              </FormControl>)
          }
        })
      }
        {/* <TextField
            label="Project ID"
            id="project_id"
            className='my-2'
            defaultValue={data && data.project_id}
            autoFocus
            required
            error = {invalid.project_id && true}
          />
          {invalid.project_id && <p className={`text-danger small m-0 mb-2`} style={{textAlign:"left"}}>{invalid.project_id}</p>}
        <TextField
            label="Full Name"
            id="name"
            className='my-2'
            defaultValue={data && data.name}
            required
            error = {invalid.name && true}
          />
          {invalid.name && <p className={`text-danger small m-0 mb-2`} style={{textAlign:"left"}}>{invalid.name}</p>}

          <Form.Label htmlFor="description">Description</Form.Label>
          <textarea id="description" 
          className={`form-control px-3 ${invalid.description && "border-danger"}`} 
          name="description" 
          minLength={10} 
          defaultValue={data && data.description} placeholder={data && data.description}/>
          {invalid.description && <p className={`text-danger small m-0 mb-2`} style={{textAlign:"left"}}>{invalid.description}</p>} */}

          {/* <DatePicker 
          label="Start Date"
          format="YYYY-MM-DD"
          inputFormat="YYYY-MM-DD"
          value={options.start_date ? options.start_date : invalid.start_date ? dayjs(""): null}
          onChange={(e)=>setOptions({...options, start_date: e})}
          id="start_date" 
          className={`my-2`} 
          error = {invalid.start_date && true}>
            {data && data.start_date}
            </DatePicker>
            {invalid.start_date && <p className={`text-danger small m-0 mb-2`} style={{textAlign:"left"}}>{invalid.start_date}</p>}
            <DatePicker 
          label="End Date"
          format="YYYY-MM-DD"
          inputFormat="YYYY-MM-DD"
          value={options.end_date && options.end_date}
          minDate={options.start_date}
          onChange={(e)=>setOptions({...options, end_date: e})}
          id="end_date" 
          className="my-2">
            {data && data.end_date}
            </DatePicker> */}

        {/* <SelectSearch table="keyword" add={false} multi={true} list={true}
          options={options} setOptions={setOptions} 
          data={keywords_list}
          error = {invalid.keywords && true}/>
          {invalid.keywords && <p className={`text-danger small m-0 mb-2`} style={{textAlign:"left"}}>{invalid.keywords}</p>}
          
      <SelectSearch table="method" add={false} multi={true} list={true}
          options={options} setOptions={setOptions} 
          data={methods_list}
          error = {invalid.methods && true}/>
          {invalid.methods && <p className={`text-danger small m-0 mb-2`} style={{textAlign:"left"}}>{invalid.methods}</p>}

      <SelectSearch table="type" add={false} multi={false} list={true}
          options={options} setOptions={setOptions} 
          data={type_list}/>

      <FormControl className="py-2 w-100">

      <SelectSearch table="person" add={true} multi={true} 
          options={options} setOptions={setOptions} 
          data={persons} parameter={["first_name", "last_name"]}
          setModalOpened={setModalOpened}
          error = {invalid.persons && true}/>
          {invalid.persons && <p className={`text-danger small m-0 mb-2`} style={{textAlign:"left"}}>{invalid.persons}</p>}

        <Form.Text muted>
        Add people who are part of this Project
      </Form.Text>
      </FormControl>

      <SelectSearch table="group" add={true} multi={true} 
          options={options} setOptions={setOptions} 
          data={groups} parameter="name"
          setModalOpened={setModalOpened}
          error = {invalid.groups && true}/>
          {invalid.groups && <p className={`text-danger small m-0 mb-2`} style={{textAlign:"left"}}>{invalid.groups}</p>}

      <SelectSearch table="partner" add={true} multi={true} 
          options={options} setOptions={setOptions} 
          data={partners} parameter="name"
          setModalOpened={setModalOpened}/>

      <SelectSearch table="resource" add={true} multi={true} 
          options={options} setOptions={setOptions} 
          data={resources} parameter="full_name"
          setModalOpened={setModalOpened}/>

      <SelectSearch table="project" add={false} multi={true} 
          options={options} setOptions={setOptions} 
          data={projects} parameter="project_id" filter_id={data && data.id}/>

        <FormControl className="py-2 w-100">
          <SelectSearch table="user" add={false} multi={true} 
          options={options} setOptions={setOptions} 
          data={users} parameter={["first_name", "last_name"]}/>
        <Form.Text muted>
        Add other people who you would like 
        to be able to edit this entry
      </Form.Text>
      </FormControl> */}
        <Button className="mt-5" variant="contained" onClick={handleSave}>
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

export default ProjectForm