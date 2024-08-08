import React, { useState , useEffect, useRef} from 'react'
import './DataTable.css'

const DataTable = () => {
    const [name, setName] = useState("");
    const [gender, setGender] = useState("");
    const [age,setAge] = useState(1);
    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(false);
    const outSideClick = useRef(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const indexOfLAstItem = currentPage*itemsPerPage;
    const indexOfFirstItem = indexOfLAstItem - itemsPerPage;
    const [searchTerm, setsearchTerm] = useState("");
    const filterData = data.filter((item)=>item.name.toLowerCase().includes(searchTerm.toLowerCase())).slice(indexOfFirstItem, indexOfLAstItem)


    useEffect(() => {
        if(!editId){
            return ;
        }
        let selectedIditem = document.querySelectorAll(`[id = '${editId}']`)
        selectedIditem[0].focus();
    }, [editId])

    useEffect(() => {
        const handleClickOutSide = (event) =>{
            if(outSideClick.current && !outSideClick.current.contains(event.target))
                setEditId(false);

        }
        document.addEventListener("click",handleClickOutSide)
        return () =>{
            document.removeEventListener("click", handleClickOutSide)
        }
    
    }, [])

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm])

   const handleAddClick = () =>{
        if(name && gender && age){
             const newItem = {
                id: Date.now(),
                name: name,
                gender: gender,
                age: age
            };
            setData([...data, newItem])
            setName("")
            setGender("")
            setAge("")
        }
   }
   const handleDelete = (id) =>{
        if(filterData.length === 1 && currentPage !== 1){
            setCurrentPage((prev)=>prev-1);
        }
        const updatedList = data.filter((item) => item.id !== id);
        setData(updatedList)
   }
    
   const handleEdit = (id, updatedData)=>{
    if(!editId || editId !== id){
        return ;
    }
    const updatedList = data.map((item) => item.id === id ? {...item, ...updatedData}: item);
    setData(updatedList);
   }
   console.log(data);

   const handleSearch = (e) =>{
    setsearchTerm(e.target.value)

   }
   const paginate = (pageNumber) =>{
    setCurrentPage(pageNumber);

   }
  return (
    <div className='container'>
        <h1>Advanced Data Table</h1>
        <div className="add-container">
            <div className="info-container">
                <input type="text" placeholder='Name : ' name='name' value={name} onChange={(e) =>setName(e.target.value)}/>
                <input type="text" placeholder='Gender :' name='gender'  value={gender} onChange={(e) =>setGender(e.target.value)}/>
                <input type="number" placeholder='Age :' name='age' value={age} onChange={(e) =>setAge(e.target.value)}/>
            </div>

            <button className='add-btn' onClick={handleAddClick}>Add</button>

        </div>
        <div className="search-table-container">
        <input type="text" placeholder='Search by Name :' name='search' value={searchTerm} onChange={handleSearch} className='search-input'/>

        <table ref={outSideClick}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Age</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {
                    filterData.map((item) => (
                        <tr key={item.id}>
                            <td id={item.id} contentEditable = {editId === item.id} onBlur={(e) => handleEdit(item.id, {name: e.target.innerText})}>{item.name}</td>
                            <td id={item.id} contentEditable = {editId === item.id} onBlur={(e) => handleEdit(item.id, {name: e.target.innerText})}>{item.gender}</td>
                            <td id={item.id} contentEditable = {editId === item.id} onBlur={(e) => handleEdit(item.id, {name: e.target.innerText})}>{item.age}</td>
                            <td className='actions'>
                                <button className='actions-btn1' onClick={()=>setEditId(item.id)}>Edit</button>
                                <button className='actions-btn2' onClick={() => handleDelete(item.id)}>Delete</button>
                            </td>
                            </tr> 
                    ))
                }
                
            </tbody>
        </table>
        <div className="pagination">
            {Array.from({length: Math.ceil(data.length/itemsPerPage)},(_,index)=>(
                <button key={index+1} onClick={() =>paginate(index+1)} style = {{backgroundColor: currentPage === index+1 && 'blue'}}>{index+1}</button>
            ))}
        </div>

        </div>
      
    </div>
  )
}

export default DataTable
