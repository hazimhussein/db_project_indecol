import {DatePicker} from "@mui/x-date-pickers"
import ProjectForm from "./forms/ProjectForm"
import PersonForm from "./forms/PersonForm"
import GroupForm from "./forms/GroupForm"
import ResourceForm from "./forms/ResourceForm"
import PartnerForm from "./forms/PartnerForm"

function FormPicker({table, setData, data, setModifiedNodes}){
    if (table == "project"){
        return <ProjectForm setData={setData} data={data} setModifiedNodes={setModifiedNodes}/>
    } else if (table == "person"){
        return <PersonForm setData={setData} data={data} setModifiedNodes={setModifiedNodes}/>
    } else if (table == "group"){
        return <GroupForm setData={setData} data={data} setModifiedNodes={setModifiedNodes}/>
    } else if (table == "resource"){
        return <ResourceForm setData={setData} data={data} setModifiedNodes={setModifiedNodes}/>
    } else if (table == "partner"){
        return <PartnerForm setData={setData} data={data} setModifiedNodes={setModifiedNodes}/>
    }
    
}

export default FormPicker