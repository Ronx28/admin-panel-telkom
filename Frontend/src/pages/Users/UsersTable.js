import React, { useState, useEffect } from 'react';
import Table from '../../components/Table';
import  './UserTable.css';


const UsersTable = () => {
  // State untuk menyimpan data tabel
  const [tableData, setTableData] = useState({
    header: [
      'No',
      'Date',
      'Id Telegram',
      'Name',
      'Email',
      'Telephone',
      'Password',
      'Devisi',
      'Sub Devisi',
      'Link',
    ],
    body: [], 
  });

  // State untuk menyimpan kata kunci pencarian
  const [searchKeyword, setSearchKeyword] = useState('');

  // State untuk menyimpan data yang telah difilter
  const [filteredData, setFilteredData] = useState([]);

  // Fungsi untuk fetch data dari backend
  const fetchTableData = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/UserTable');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Meng-update state dengan data yang diterima
      setTableData((prevState) => ({
        ...prevState,
        body: data,
      }));

      setFilteredData(data); // Set data yang telah difetch sebagai data yang difilter juga
    } catch (error) {
      console.error('Error fetching table data:', error);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    fetchTableData();
  }, []);

  // Fungsi untuk merender header
  const renderHead = (row, index) => {
    return <th key={index}>{row}</th>;
  };

  // Fungsi untuk merender body
  const renderBody = (row, index) => {
    return (
      <tr key={row.idTele}>
        <td>{index + 1}</td> {/* Menambahkan nomor urut */}
        <td>{row.timestamp}</td>
        <td>{row.idTele}</td>
        <td>{row.nama || 'N/A'}</td>
        <td>{row.email || 'N/A'}</td> {/* Tambahkan fallback jika email tidak ada */}
        <td>{row.telepon || 'N/A'}</td>
        <td>{row.password || 'N/A'}</td>
        <td>{row.devisi || 'N/A'}</td>
        <td>{row.subDevisi || 'N/A'}</td>
        <td>{row.link || 'N/A'}</td>
      </tr>
    );
  };

  // Fungsi untuk menghandle pencarian
  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearchKeyword(keyword);

    // Filter data berdasarkan kata kunci pencarian
    const filtered = tableData.body.filter((item) => {
      return (
        item.nama.toLowerCase().includes(keyword.toLowerCase()) ||
        item.email.toLowerCase().includes(keyword.toLowerCase()) ||
        item.idTele.toLowerCase().includes(keyword.toLowerCase()) ||
        item.telepon.toLowerCase().includes(keyword.toLowerCase())
      );
    });

    setFilteredData(filtered);
  };

  return (
    <div>
      {/* Input untuk mencari user */}
      <input
        type="text"
        placeholder="Search by Name, Email, ID Telegram, or Telephone"
        value={searchKeyword}
        onChange={handleSearch}
      />
      {/* Tabel */}
      <Table
        limit="10"
        headData={tableData.header}
        bodyData={filteredData}
        renderHead={renderHead}
        renderBody={renderBody}
      />
    </div>
  );
};

export default UsersTable;
