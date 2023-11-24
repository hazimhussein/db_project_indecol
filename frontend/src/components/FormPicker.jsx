import {DatePicker} from "@mui/x-date-pickers"
import ProjectForm from "./forms/ProjectForm"
import PersonForm from "./forms/PersonForm"
import GroupForm from "./forms/GroupForm"
import ResourceForm from "./forms/ResourceForm"
import PartnerForm from "./forms/PartnerForm"

function FormPicker({table, setData, data}){
    if (table == "project"){
        return <ProjectForm setData={setData} data={data}/>
    } else if (table == "person"){
        return <PersonForm setData={setData} data={data}/>
    } else if (table == "group"){
        return <GroupForm setData={setData} data={data}/>
    } else if (table == "ressource"){
        return <ResourceForm setData={setData} data={data}/>
    } else if (table == "partner"){
        return <PartnerForm setData={setData} data={data}/>
    }
    
}

export default FormPicker