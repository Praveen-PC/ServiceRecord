import React, { useEffect, useState } from "react";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import DataTable from 'react-data-table-component';

const Home = () => {
  const [data, setdata] = useState([]);
  const [details, setdetails] = useState('');

  const [searchdata, setSearchData] = useState([]);
  const [search, setSearch] = useState('');

  const [filtertype, setFiltertype] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [result,setResult]=useState(true)

  useEffect(() => {
    if (filtertype === 'imei') {
      setPlaceholder('Enter IMEI Number');
    } else if (filtertype === 'controller') {
      setPlaceholder('Enter Controller Number');
    } else if (filtertype === 'date') {
      setPlaceholder('Enter Date');
    } else {
      setPlaceholder('Enter Project Name');
    }
  }, [filtertype]);

  
  const handleSearch = () => {
    const value = search; 
    let filterResults = [];

    if (filtertype === 'imei') {
      filterResults = data.filter((item) =>
        item.imei.toLowerCase().includes(value.toLowerCase())
      );
    } else if (filtertype === 'controller') {
      filterResults = data.filter((item) =>
        item.controllersn.toLowerCase().includes(value.toLowerCase())
      );
    } else if (filtertype === 'date') {
      filterResults = data.filter((item) =>
        item.date.includes(value)  
      );
    }else{
      filterResults=data.filter((item)=>
        item.project.toLowerCase().includes(value.toLowerCase())
    )
  }
    
    setSearchData(filterResults);
    setSearch('')

    if(filterResults.length===0){
      setResult(false)
    }else{
      setResult(true)
    }
    
  };

  
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/alldetails');
      setdata(response.data.reverse());  
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [details]);

  const parseDetails = (details) => {
    const parsedData = {};

    const regexPatterns = {
      customername: /Customer Name:\s*(.*)/i,
      project: /Project:\s*(.*)/i,
      district: /District:\s*(.*)/i,
      model: /Model\s*:\s*(.*)/i,
      controllersn: /Controller SN:\s*(.*)/i,
      issuereported: /Issue Reported:\s*(.*)/i,
      faultcode: /FaultCode in LCD:\s*(.*)/i,
      imei: /IMEI\s*:\s*(.*)/i,
    };

    Object.keys(regexPatterns).forEach((key) => {
      const match = details.match(regexPatterns[key]);
      if (match) {
        parsedData[key] = match[1].trim();
      }
    });

    return parsedData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const parsedData = parseDetails(details);

    try {
      const response = await axios.post('http://localhost:8000/api/addrecord', parsedData);
      console.log(response.data);
      setdetails('');
    } catch (error) {
      console.log(error);
    }
  };

  
  const columns = [
    { name: "CustomerName", selector: row => row.customername, sortable:true },
    { name: "Project", selector: row => row.project },
    { name: "District", selector: row => row.district },
    { name: "Model", selector: row => row.model },
    { name: "ControllerSN", selector: row => row.controllersn },
    { name: "Issue", selector: row => row.issuereported },
    { name: "Fault", selector: row => row.faultcode },
    { name: "IMEI", selector: row => row.imei },
    { name: "Date", selector: row => row.date , sortable:true },
  ];

  return (
    <>
      <nav className="navbar navbar-light bg-light">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Macsoft</span>
        </div>
      </nav>

      <div className="container mt-3">
        <div className="d-flex justify-content-between">
          <h2>Service Record</h2>
          <small>
            <button
              type="button"
              className="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Add
            </button>
          </small>
        </div>

        <div className="border rounded mt-3 p-3">
          <div className="d-flex flex-wrap justify-content-start gap-3 mx-3">
            <div className="">
              <select
                className="form-select"
                aria-label="Default select example"
                value={filtertype}
                onChange={(e) => setFiltertype(e.target.value)}
              >
                <option value="">Select Filter Type</option>
                <option value="imei">IMEI</option>
                <option value="controller">Controller</option>
                <option value="date">Date</option>
              </select>
            </div>
            <div className="">
              <input
                type={filtertype === 'date' ? 'date' : 'search'}
                className="form-control"
                placeholder={placeholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <button type="button"  className="btn btn-success btn-medium" onClick={handleSearch} >
                Search
              </button>
            </div>

            <div>
              <button type="submit" className="btn btn-primary btn-medium">
                Export
              </button>
            </div>
           

{result === false && (
  <div 
    className="alert alert-danger alert-sm" 
    style={{ fontSize: '0.9rem', padding: '7px 10px', margin: '0px' }} 
    role="alert"
  >
    No records found ... !
  </div>
)}
          </div>
          
        </div>

        <div className="mt-2 border rounded">
          <DataTable
            data={searchdata.length > 0 ? searchdata : data} 
            pagination
            highlightOnHover
            columns={columns}
          />
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                Add Record
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="details" className="col-form-label">
                    Record Details:
                  </label>
                  <textarea
                    className="form-control"
                    id="message-text"
                    style={{ height: "7cm" }}
                    value={details}
                    onChange={(e) => setdetails(e.target.value)}
                  ></textarea>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
