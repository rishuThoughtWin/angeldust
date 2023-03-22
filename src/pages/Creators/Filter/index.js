import React from 'react';
import Search from "assets/img/icons/search.png";


let setTimeoutData = null;

function AuthorFilter(props) {
  const { searchText } = props;
  const isAdmin = localStorage.getItem("owner")

  const handleChange = (e) => {
    clearTimeout(setTimeoutData);
    props.onChange(e.target.value);

    setTimeoutData = setTimeout(() => {
      props.onSubmitForm(e.target.value);
    }, 1000);

  }

  const handleSearch = (e) => {
    e.preventDefault();
  }


  return (

    <div className="main__filter bleuFrosted main__filternew modal_Angeldustlter creator_filter">
      <div className="row">
        <div className="col-lg-6 col-xl-6 col-md-5 col-5 pl-md-1">
          <form onSubmit={handleSearch} className="main__filter-search">
            <input
              type="text"
              placeholder="Search for a creator…"
              onChange={(e) => handleChange(e)}
              value={searchText}
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
        </div>

        <div className="col-xl-6 col-lg-6 col-md-7 col-7 text-right pl-0 pr-md-3">
          <div className="main__filter-wrap d-inline-block mr-md-2 mr-0">
            <h4 className="d-inline-block mr-2">Sort by</h4>
            <select
              className="sign__select creatorsFilter"
              name="status"
              onChange={(e) => {
                props.onSort(e.target.value)
              }}
            >
              <option value="mostP">Most popular</option>
              <option value="leastP">Least popular</option>
              <option value="mostS">Most sales</option>
              <option value="leastS">Least sales</option>
              <option value="following">Following</option>
            </select>
          </div> 



          <div className="delete-marketdiv delete-marketcreator d-inline-block mt-md-0 mt-3">
            {/* {props.deleteNFTListId.length > 0 ? (
              <button
                type="button"
                className="btn delete-btn"
                data-toggle="modal"
                data-target="#blackListPop"
              >
                Confirm
              </button>
            ) :
              isAdmin == 'true' &&
              (
                <button
                  type="button"
                  className="btn delete-btn"
                  onClick={() => props.deletehandler()}
                >
                  BlackList
                </button>
              )
            } */}

            <div
              className="modal fade"
              id="blackListPop"
              tabindex="-1"
              role="dialog"
              aria-labelledby="exampleModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-body">
                    <div className="">
                      <div style={{ color: 'black' }}> Are you want to delete this</div>

                    </div>
                  </div>
                  <div className="modal-footer text-center">
                    <button
                      type="button"
                      className="btn btn-primary mr-3"
                      onClick={() => props.blackListHandler()}
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-dismiss="modal"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AuthorFilter
