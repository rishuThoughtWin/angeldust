import React, {useState} from 'react'


export const NavDropdown=()=>{

    const[show,setShow]=useState()
    const[activeitem,setActiveItem]=useState()

    return(
        <div className='nav-dropdown-wraper'>
            <div className='nav-dropdown-element'>
                  
            </div>
            <ul>
                
            </ul>
        </div>
    )
}