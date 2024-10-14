/* eslint-disable no-unused-vars */
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import Table from '../../components/Table';

const tableData = {
  head: ['No', 'Devisi Name', 'Action'],
  body: []
};

const renderHead = (item, index) => {
  return <th key={index}>{item}</th>;
};

const renderBody = (item, index, handleDeleteDevisi) => {
  return (
    <tr key={item.id}>
      <td>{index + 1}</td>
      <td>{item.namaDevisi}</td>
      <td>
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button onClick={() => handleDeleteDevisi(item.id)} style={{backgroundColor:'brown'}}>
          Delete
        </button>
      </td>
    </tr>
  );
};

// Tambahkan forwardRef agar komponen ini bisa diakses dari luar
const TopUsersTable = forwardRef((props, ref) => {
  const [devisiData, setDevisiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDevisiData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/devisi');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setDevisiData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDevisiData();
  }, []);

  // Fungsi ini untuk memperbarui data dari luar
  useImperativeHandle(ref, () => ({
    updateDevisiData(newDevisi) {
      setDevisiData((prevData) => [...prevData, newDevisi]);
    }
  }));

  const handleDeleteDevisi = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/devisi/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete data');
      }

      setDevisiData(devisiData.filter((item) => item.id !== id));
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div style={{ height: '50vh', overflowY: 'scroll' }}>
        <Table
          headData={tableData.head}
          bodyData={devisiData}
          renderHead={renderHead}
          renderBody={(item, index) => renderBody(item, index, handleDeleteDevisi)}
        />
      </div>
    </>
  );
});

export default TopUsersTable;
