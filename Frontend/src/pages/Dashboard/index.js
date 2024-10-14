import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';

export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalDevisi, setTotalDevisi] = useState(0);
  const [totalSubDevisi, setTotalSubDevisi] = useState(0);
  const [totalQuestion, setTotalQuestion] = useState(0);

  // Fungsi untuk fetch data pengguna (Total Users)
  const fetchUserCount = async () => {
    try {
      const response = await fetch('https://admin-panel-telkom-backend.vercel.app/api/UserTable');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTotalUsers(data.length); // Jumlah total pengguna
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchTotalDevisi = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/devisi');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTotalDevisi(data.length); // Jumlah total devisi
    } catch (error) {
      console.error('Error fetching devisi data:', error);
    }
  };
  

  // Fungsi untuk fetch data produk (Total Products)
  const fetchTotalSubDevisi = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/subDevisi');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTotalSubDevisi(data.length); // Jumlah total produk
    } catch (error) {
      console.error('Error fetching products data:', error);
    }
  };

  // Fungsi untuk fetch data pesanan (Total Orders)
  const fetchTotalQuestion = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/question');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTotalQuestion(data.length); // Jumlah total pesanan
    } catch (error) {
      console.error('Error fetching orders data:', error);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    // Memanggil semua API saat komponen pertama kali di-mount
    fetchUserCount();
    fetchTotalDevisi();
    fetchTotalSubDevisi();
    fetchTotalQuestion();
  }, []);

  return (
    <div>
      <h2 className='page-header'>Dashboard</h2>
      <div className='row'>
        <div className='col-10'>
          <div className='col'>
            {/* Card 1: Total Users */}
            <div className='col-6'>
              <Card
                icon="fas fa-user"
                count={totalUsers}
                title="Total Users"
                color="green"
              />
            </div>

            {/* Card 2: Total Sales */}
            <div className='col-6'>
              <Card
                icon="fas fa-users"
                count={totalDevisi}
                title="Total Devisi"
                color="blue"
              />
            </div>

            {/* Card 3: Total Products */}
            <div className='col-6'>
              <Card
                icon="fas fa-street-view"
                count={totalSubDevisi}
                title="Total Sub Devisi"
                color="amber"
              />
            </div>

            {/* Card 4: Total Orders */}
            <div className='col-6'>
              <Card
                icon="fas fa-question"
                count={totalQuestion}
                title="Total Question"
                color="red"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
