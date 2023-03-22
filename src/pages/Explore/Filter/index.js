import React from 'react';
import Search from "assets/img/icons/search.png";

function Filter(props) {
  const {onFormSubmit} = props;
  const isAdmin = localStorage.getItem("owner")
  const handleChange = (e) => {
    props.onChange(e.target.value)
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    props.onFormSubmit();
  }


  return (

    <div className="main__filter bleuFrosted main__filternew d-inline-block filter_market">

        {/* <h4 className="d-inline-block mr-2">Search</h4> */}
          <form onSubmit={handleSubmit}  className="main__filter-search">
            <input
              type="text"
              placeholder="Search for NFTs"
              value={props.searchText}
              onChange={(e) => handleChange(e)}
            />
             <button className="btn" type="submit">
                        <img src={Search} className="search_input" alt="Search" />
                      </button>
            {/* <button type="button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z" />
            </svg>
          </button> */}
          </form>

{/* <div className='row'>
        <div className="col-xl-6 col-lg-6 col-md-7 col-7 text-right pl-0 pr-md-1">
          <div className="main__filter-wrap d-inline-block mr-2">
            <h4 className="d-inline-block mr-2">Sort by</h4>
            <select
              className="sign__select creatorsFilter"
              name="status"
              onChange={(e) => {
                props.onSort(e.target.value)
              }}
              disabled
            >
              <option value="new">Newest</option>
              <option value="old">Oldest</option>
              <option value="most">Most liked</option>
              <option value="least">Least liked</option>
            </select>
          </div>



        </div>
      </div> */}
    </div>
  )
}
export default Filter
