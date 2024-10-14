import React, { useState, useEffect } from 'react';
import Table from '../../components/Table';

const Question = ({ isModalOpen, closeModal }) => {
  // State untuk menyimpan data tabel
  const [tableData, setTableData] = useState({
    header: ['id', 'Devisi Id', 'Sub Devisi Id', 'Question'],
    body: [], // Body akan diisi setelah fetch data
  });

  // State untuk menyimpan kata kunci pencarian
  const [searchKeyword, setSearchKeyword] = useState('');

  // Fungsi untuk fetch data dari backend
  const fetchTableData = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/question');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setTableData((prevState) => ({
        ...prevState,
        body: data,
      }));
    } catch (error) {
      console.error('Error fetching table data:', error);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchTableData();
  }, []);

  // Fungsi untuk mem-filter data berdasarkan kata kunci pencarian
  const filteredData = tableData.body.filter((row) => {
    return (
      row.id.toString().includes(searchKeyword) ||
      row.devisiId.toString().includes(searchKeyword) ||
      row.subDevisiId.toString().includes(searchKeyword) ||
      row.pertanyaan?.toLowerCase().includes(searchKeyword.toLowerCase())
    );
  });

  // Fungsi untuk menutup modal dan melakukan pencarian
  const handleSearch = () => {
    closeModal();
  };

  return (
    <div>
      {/* Modal */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
<span className="close" onClick={closeModal}>&times;</span>
            <h2>Search Data</h2>

            {/* Form untuk pencarian */}
            <form>
              <div className="form-group">
                <label htmlFor="search">Search:</label>
                <input
                  type="text"
                  id="search"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Enter id, Devisi Id, Sub Devisi Id, or Question"
                />
              </div>

              <button type="button" onClick={handleSearch}>
                Search
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tabel */}
      <Table
        limit="10"
        headData={tableData.header}
        bodyData={filteredData} // Data yang sudah di-filter
        renderHead={(row, index) => <th key={index}>{row}</th>}
        renderBody={(row, index) => (
          <tr key={row.id}>
            <td>{row.id}</td>
            <td>{row.devisiId}</td>
            <td>{row.subDevisiId}</td>
            <td>{row.pertanyaan || 'N/A'}</td>
          </tr>
        )}
      />
    </div>
  );
};

export default Question;
