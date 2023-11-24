// import { func } from 'assert-plus'
// import { div } from 'prelude-ls'
import React, {Component, useState, useEffect} from 'react'
import { connect, useSelector } from 'react-redux'
import Question from './Question'
// import { BrowserRouter as Router, Route } from 'react-router-dom'
// import { handleGetTableC } from '../actions/data'
import TableView from './TableView'
import { dataData, statusData } from '../reducers/data';
import { useDispatch } from 'react-redux';
import { getTableData } from '../utils/api';
import { useParams } from 'react-router-dom';
import Nav from './Nav';





function Dashboard(){
    let { category } = useParams();
    category = category ? category : "category"

    let dispatch = useDispatch();

    

    const data = useSelector(dataData)
    const isLoading = useSelector(statusData)
    let data_current = data[category] ? data[category] : []

    useEffect(()=>{
      dispatch(getTableData(category))
    }, [dispatch, category])

    
    
    // const [optimizedView, setOptimizedView] = useState(true)
    // const [searchInput, handleSearchChange] = useState("")


        return(
          <>
          <Nav></Nav>
            <div className='dashboard'>
                {/* {category != "category" && <div className='toggle-questions'>
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
                  </div>} */}
                {/* {optimizedView ? <div className='questions'>
                 {(category != "category")&& 
                    <div key="search-bar" className="form-group row">
                      <div className="col-sm-10">
                        <input type='text' className="form-control" id={`colFormLabelSearchBar`} value={searchInput} placeholder="Search..." onChange={(e)=>handleSearchChange(e.target.value)}/>
                      </div>
                    </div>}
                    {data_current.filter(dat=>{
                      let name = "" 
                      if (category == "person"){
                        name = dat.first_name + " " + dat.last_name
                      } else if (category == "user"){
                        name = dat.username
                      } else if (category == "ressource"){
                        name = dat.full_name
                      } else {
                        name = dat.name
                      }
                      return  name.toLowerCase().includes(searchInput.toLowerCase())
                    }).map(cat => (
                      <Question key={cat.id} id={cat.id} table={category} data={cat}/>
                  ))}</div>
                :  */}
                <TableView key={category} table={category}/>
                {/* } */}
            </div>
            </>)
}

export default Dashboard
