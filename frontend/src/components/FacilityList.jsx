import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FacilityList = () => {
  const [facilities, setFacilities] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/facilities/', {
          params: { search: searchTerm, page: currentPage },
        });
        const { results, count } = response.data;
        setFacilities(results);
        setTotalPages(Math.ceil(count / 10)); // Assuming page size is 10
      } catch (error) {
        console.error('Error fetching facilities:', error);
      }
    };
    fetchFacilities();
  }, [searchTerm, currentPage]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/facilities/${id}/`);
      setFacilities(facilities.filter((facility) => facility.id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="facility-list">
      <h2>Facilities</h2>
      <input
        type="text"
        placeholder="Search facilities..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reset to first page when searching
        }}
      />
      <Link to="/facilities/add" className="add-button">
        Add New Facility
      </Link>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {facilities.map((facility) => (
            <tr key={facility.id}>
              <td>{facility.name}</td>
              <td>{facility.location}</td>
              <td>{facility.type}</td>
              <td>{facility.capacity}</td>
              <td>
                <Link to={`/facilities/edit/${facility.id}`} className="edit-link">
                  Edit
                </Link>
                <button onClick={() => handleDelete(facility.id)} className="delete-button">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default FacilityList;