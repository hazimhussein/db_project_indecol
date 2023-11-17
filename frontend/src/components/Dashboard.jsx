// import { func } from 'assert-plus'
// import { div } from 'prelude-ls'
import React, {Component, useState} from 'react'
import { connect, useSelector } from 'react-redux'
// import Question from './Question'
// import { BrowserRouter as Router, Route } from 'react-router-dom'
// import { handleGetTableC } from '../actions/data'
// import TableView from './TableView'


function Dashboard({category}){
    // state={
    //     answered: false,
    //     optimizedView: true,
    //     tableColumn: [],
    //     searchInput:''
    // }

    const categories = ["user", "person", "group", "partner", "ressource", "project"]
    const [optimizedView, setOptimizedView] = useState(true)

    if (category){
      let data = useSelector(state => state.data.value[category])
    }

    // toggleAnswered=(e, answered)=>{
    //     this.setState(()=>{
    //       return{
    //         answered: answered,
    //       }
    //     })
    // }
    // toggleView= async (e, view)=>{
    //   const {currentTable}=this.props
    //   let columns = !view ? await handleGetTableC(currentTable)
    //                       : []
    //   this.setState(()=>{
    //     return{
    //       tableColumn: columns,
    //       optimizedView: view
    //     }
    //   })
    // }

    // handleSearchChange=(e)=>{
    //   const searchInput = e.target.value

    //   this.setState(()=>({
    //     searchInput: searchInput,
    //   }))
  // }

        return(
            <div className='dashboard'>
                {category ? <div className='toggle-questions'>
                      <span
                      className={`toggle-btn left ${optimizedView && 'active'}`}
                      onClick={()=> setOptimizedView(true)}>
                          Optimized View
                      </span>
                      <span
                      className={`toggle-btn right ${!optimizedView && 'active'}`}
                      onClick={()=> setOptimizedView(false)}>
                          Classic View
                      </span>
                  </div>
                  : <div className='questions'>
                  {categories.map(cat => (
                    <span key={cat}>{cat}</span>
                    // <Question key={cat} id={cat} category={true} type={"Services"}/>
                  ))}</div>}</div>)
                }
                // {optimizedView ? <div className='questions'>
                 // {(dataShown!==null)&& 
            //         <div key="search-bar" className="form-group row">
            //           <div className="col-sm-10">
            //             <input type='text' className="form-control" id={`colFormLabelSearchBar`} value={searchInput} placeholder="Search..." onChange={(e)=>this.handleSearchChange(e)}/>
            //           </div>
            //         </div>}
            //       { (dataShown!==null) ? 
            //       Object.keys(dataShown).filter((k)=>dataShown[k]['name'].toLowerCase().includes(searchInput.toLowerCase())).map((q)=>(<Question key={q} id={q} category={false}/>))
            //       : answered ? answeredQ.map((q)=>(<Question key={q} id={q} category={true} type={"Services"}/>))
            //                 : unansweredQ.map((q)=>(<Question key={q} id={q} category={true} type={"Staff"}/>))}
            //     </div>
            //     : <TableView dataS={dataShown} tableColumns={tableColumn}/>}
            // </div> 
        

// function mapStateToProps({category}, props){
  

//   let data=null;
//   if (category){
//     data = useSelector(state => state.data.value[category])
//   }

//     const user = users[authedUser]
//     const answeredQ = Object.keys(categories.services)
//     const unansweredQ = Object.keys(categories.staff)
//     // const unansweredQ = Object.keys(questions).filter((question)=> !(question in user.answers))
//     return{
//         answeredQ: answeredQ,
//             // .sort((a,b)=> questions[b].timestamp - questions[a].timestamp),
//         unansweredQ: unansweredQ,
//         currentTable: servicename,
//             // .sort((a,b)=> questions[b].timestamp - questions[a].timestamp)
//         dataShown: dataShown
//     }
// }

export default Dashboard
