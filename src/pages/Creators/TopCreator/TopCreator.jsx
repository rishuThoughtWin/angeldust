import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

import { getAllUsersApiV2 } from "apis";
import Loader from "../../../components/Loader";
import { getCreators } from "apis";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export const TopCreator = () => {
  const [users, setUsers] = useState([]);
  const [userslength, setUserslength] = useState();
  const [filterData, setFilter] = useState(users);
  const [play, setPlay] = useState(true);
  const [limit, setLimit] = useState(5);
  const [pageNo, setPageNo] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const limitPerPage = 5;
  const [checkedAcc, setCheckedAcc] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const tokenId = useSelector((state) => state?.tokenData?.token);

  useEffect(() => {
    getUserData();
  }, [pageNo]);

  const getUserData = async (isNew = false) => {
    if (isNew) {
      setPageNo(1);
    }
    setPlay(true);
    const req = {
      page: isNew ? 1 : pageNo,
      limit: limitPerPage,
    };

    const res = await getAllUsersApiV2(req);

    const data = res?.data?.success?.data.results;

    if (data?.length) {
      setUsers(isNew ? data : [...users, ...data]);
      setFilter(isNew ? data : [...users, ...data]);
      setUserslength(data?.length);
      setTotalPage(res?.data?.success?.data?.totalPages);
      setCurrentPage(Number(res?.data?.success?.data.page));
    } else {
      setUsers([]);
      setFilter([]);
    }
    setPlay(false);
    return;
  };

  const handleShowMoreUsers = () => {
    if (limit <= userslength) {
      setLimit(limit + 12);
    }
    setPageNo(pageNo + 1);
  };
  const handleChange = (e, address) => {
    let checkboxValue = e.target.checked;
    setIsChecked(e.target.checked === true ? true : false);
    if (checkboxValue === true) {
      setCheckedAcc([...checkedAcc, address]);
    } else {
      const filteredAddresses = checkedAcc.filter((item) => {
        return item !== address;
      });
      setCheckedAcc(filteredAddresses);
    }
  };
  const reqTopCreator = {
    token: tokenId,
    topList: checkedAcc,
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await getCreators(reqTopCreator);

      if (response.status && response.data.success.code === 200) {
        toast.success(response.data.success.message);
      } else {
        toast.error("Please try again.");
      }
    } catch (error) {
      toast.error("Please try again.", error);
    }
  };

  return (
    <div className="col-md-9 col-12 mt-20">
      <div className="creator_table mt-20">
        <div>
          <Table responsive="sm">
            <thead>
              <tr>
                <th>Name</th>
                <th>Nick Name</th>
                <th>Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterData &&
                filterData.map((row, index) => {
                  return (
                    <tr>
                      <td className="name_head">{row.firstName}</td>
                      <td className="name_head">{row.nickName}</td>
                      <td className="name_head">{row.account}</td>

                      <td>
                        <div class="form-group">
                          <input
                            type="checkbox"
                            defaultChecked={Boolean(row.isSelected)}
                            id={`html${index}`}
                            // {row.isSelected === 1 && checked}
                            // {conditionalChecked}
                            // value={row.account}
                            onClick={(e) => handleChange(e, row.account)}
                          />
                          <label for={`html${index}`}></label>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </div>
      </div>
      <div className="row row--grid pb-0 pb-md-5">
        <div className="col-12">
          <Loader isLoading={play} />
          {filterData && filterData.length > 0 && totalPage > currentPage && (
            <button
              className="main__load"
              type="button"
              onClick={handleShowMoreUsers}
              variant="contained"
            >
              Load more
            </button>
          )}
        </div>
      </div>

      <div className="row">
        <div class="col-md-12 text-right">
          <button className="creator_submit btn" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
