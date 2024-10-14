/* eslint-disable no-unused-vars */
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import TopUsersTable from './DataDevisi';
import LastOrdersTable from './DataSubDevisi';

export default function Dashboard() {
  const [devisiName, setDevisiName] = useState('');
  const [subDevisiName, setSubDevisiName] = useState('');
  const topUsersTableRef = useRef(null);
  const lastOrdersTableRef = useRef(null);

  // Fungsi untuk menambah devisi baru
  const handleAddDevisi = async () => {
    if (!devisiName) {
      alert('Nama devisi harus diisi');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/devisi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ namaDevisi: devisiName }),
      });

      if (!response.ok) {
        throw new Error('Failed to add data');
      }

      const addedData = await response.json();

      // Memperbarui tabel devisi setelah menambah data
      if (topUsersTableRef.current) {
        topUsersTableRef.current.updateDevisiData(addedData);
      }

      setDevisiName(''); // Reset input field setelah menyimpan data
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  // Fungsi untuk menambah sub devisi baru
  const handleAddSubDevisi = async () => {
    if (!subDevisiName) {
      alert('Nama sub devisi harus diisi');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/subdevisi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ namaSubDevisi: subDevisiName }),
      });

      if (!response.ok) {
        throw new Error('Failed to add data');
      }

      const addedData = await response.json();

      // Memperbarui tabel sub devisi setelah menambah data
      if (lastOrdersTableRef.current) {
        lastOrdersTableRef.current.updateSubDevisiData(addedData);
      }

      setSubDevisiName(''); // Reset input field setelah menyimpan data
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <h2 className="page-header">Data</h2>
      <div className="row">
        <div className="col-6">
          <div className="card">
            <div className="card-header col" style={{ position: 'relative' }}>
              <h3>Data Devisi</h3>
              {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
              <button
                className="btn btn-primary"
                style={{
                  backgroundColor: 'purple',
                  position: 'absolute',
                  right: 0,
                  top: 10,
                  borderRadius: 10,
                  width: 80,
                  height: 40,
                }}
                data-toggle="modal"
                data-target="#addDevisiModal"
              >
                <i className="fas fa-plus" /> Add
              </button>
            </div>

            {/* Modal untuk Devisi */}
            <div
              className="modal fade"
              id="addDevisiModal"
              tabIndex="-1"
              aria-labelledby="addDevisiModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="addDevisiModalLabel">
                      Add Devisi
                    </h5>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="form-group">
                        <label htmlFor="inputDevisiName">Nama Devisi</label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputDevisiName"
                          value={devisiName}
                          onChange={(e) => setDevisiName(e.target.value)}
                          placeholder="Masukkan Nama Devisi"
                        />
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleAddDevisi}
                      data-dismiss="modal"
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body">
              <TopUsersTable ref={topUsersTableRef} />
            </div>
          </div>
        </div>

{/* Table Sub Devision */}
        <div className="col-5">
          <div className="card">
            <div className="card-header col" style={{ position: 'relative' }}>
              <h3>Sub Devisi</h3>
              {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
              <button
                className="btn btn-primary"
                style={{
                  backgroundColor: 'purple',
                  position: 'absolute',
                  right: 0,
                  top: 10,
                  borderRadius: 10,
                  width: 80,
                  height: 40,
                }}
                data-toggle="modal"
                data-target="#addSubDevisiModal"
              >
                <i className="fas fa-plus" /> Add
              </button>
            </div>

            {/* Modal untuk Sub Devisi */}
            <div
              className="modal fade"
              id="addSubDevisiModal"
              tabIndex="-1"
              aria-labelledby="addSubDevisiModalLabel"
              aria-hidden="true"
            >
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="addSubDevisiModalLabel">
                      Add Sub Devisi
                    </h5>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="form-group">
                        <label htmlFor="inputSubDevisiName">Nama Sub Devisi</label>
                        <input
                          type="text"
                          className="form-control"
                          id="inputSubDevisiName"
                          value={subDevisiName}
                          onChange={(e) => setSubDevisiName(e.target.value)}
                          placeholder="Masukkan Nama Sub Devisi"
                        />
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleAddSubDevisi}
                      data-dismiss="modal"
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-body">
              <LastOrdersTable ref={lastOrdersTableRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
