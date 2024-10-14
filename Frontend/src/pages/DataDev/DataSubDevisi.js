import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import Table from '../../components/Table';
import Badge from '../../components/Badge';

const orderStatus = {
  shipping: 'primary',
  pending: 'warning',
  paid: 'success',
  refund: 'danger',
};

// Fungsi untuk merender header tabel
// eslint-disable-next-line no-unused-vars
const renderHead = (item, index) => {
  return <th key={index}>{item}</th>;
};

// Fungsi untuk merender body tabel
// eslint-disable-next-line no-unused-vars
const renderBody = (item, index) => {
  return (
    <tr key={index}>
      <td>{item.id}</td>
      <td>{item.namaSubDevisi}</td>
      <td>
        <Badge type={orderStatus[item.status]} content={item.status} />
      </td>
    </tr>
  );
};

export default function DataSubDevisi() {
  const [subDevisiData, setSubDevisiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null); // Mengatur ID yang sedang dihapus

  useEffect(() => {
    const fetchSubDevisiData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/api/subDevisi');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSubDevisiData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubDevisiData();
  }, []);

  // Fungsi untuk menangani penghapusan data
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Apakah Anda yakin ingin menghapus data ini?');
    if (!confirmDelete) {
      return;
    }

    try {
      setDeletingId(id); // Mengatur ID yang sedang dihapus
      const response = await fetch(`http://localhost:4000/api/subDevisi/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Gagal menghapus data');
      }

      // Menghapus data dari state setelah berhasil dihapus dari server
      setSubDevisiData(subDevisiData.filter((item) => item.id !== id));
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      setDeletingId(null); // Reset ID yang sedang dihapus
    }
  };

  // Loading state untuk saat data sedang dimuat
  if (loading) return <p>Loading...</p>;

  // Error state untuk menampilkan error yang terjadi
  if (error) return <p>Error: {error}</p>;
  // eslint-disable-next-line no-unused-vars
  const newNumber = subDevisiData.length > 0 ? Math.max(...subDevisiData.map(item => item.nomorUrut)) + 1 : 1;

  return (
    
    <div className="main__table">
      <table id="subDevisiTable">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama Sub Devisi</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
        {subDevisiData.map((row, index) => (
    <tr key={row.id}>
      <td>{index + 1}</td> {/* Nomor urut berdasarkan indeks array */}
      <td>{row.namaSubDevisi}</td>
      <td>
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button
          className="btn btn-danger"
          onClick={() => handleDelete(row.id)}
          disabled={deletingId === row.id}
        >
          {deletingId === row.id ? 'Deleting...' : 'Delete'}
        </button>
      </td>
    </tr>
  ))}
        </tbody>
      </table>
    </div>
  );
}
