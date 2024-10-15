const { PrismaClient } = require('@prisma/client');
const { google } = require('googleapis');
const { GoogleAuth } = require('google-auth-library');
const crypto = require('node:crypto');
const nodemailer = require('nodemailer');
require('dotenv').config(); 

const prisma = new PrismaClient();
const serviceAccount = {
  type: process.env.GOOGLE_SERVICE_ACCOUNT_TYPE,
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
  universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
};
// konfigurasi Email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});

// function untuk seng email
async function sendEmail(idTele, email, password) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'ID dan Password Pendaftaran',
    text: `Halo,\n\nBerikut adalah ID dan Password Anda:\n\nID: ${idTele}\nPassword: ${password}\n\nHarap simpan informasi ini dengan baik agar Anda gunakan saat login melalui telegram apps.\n\nTerima kasih.`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${email}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}


// Function to generate random password
function generateRandomPassword(length = 12) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

// Configure Google Sheets API
const auth = new GoogleAuth({
  credentials: serviceAccount,
  scopes: 'https://www.googleapis.com/auth/spreadsheets.readonly',
});

// Function to fetch data from Google Sheets
async function fetchDataFromGoogleSheets() {
  try {
    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1AeeCmR_7P8kfw9KU28kIHa1ve6fCJunD0bnnPQatbOI'; 
    const range = 'Sheet1!A2:E';

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    return rows.map(row => ({
      timestamp: row[0] || '',
      idTele: row[1] || '',
      email: row[2] || '',
      nama: row[3] || '',
      telepon: row[4] || '',
      password: row[5] || '',
      devisi: row[6] || '',
      subDevisi: row[7] || '',
      videoLink: row[8] || '',
    }));
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);
    throw error;
  }
}


// Function to delete data not in Google Sheets
async function deleteDataNotInSheet(sheetData) {
  try {
    const idsInSheet = sheetData.map(row => row.idTele);

    const allUsers = await prisma.data_user.findMany();
    const idsInDatabase = allUsers.map(user => user.idTele);

    const idsToDelete = idsInDatabase.filter(id => !idsInSheet.includes(id));

    for (const id of idsToDelete) {
      await prisma.data_user.delete({
        where: { idTele: id },
      });
      console.log(`Data deleted from the database: ${id}`);
    }
  } catch (error) {
    console.error('Error deleting data not in sheet:', error);
  }
}

async function updateDatabaseFromSheet() {
  try {
    const sheetData = await fetchDataFromGoogleSheets();
    await deleteDataNotInSheet(sheetData);

    for (const row of sheetData) {
      const { timestamp, idTele, email, nama, telepon, devisi, subDevisi, videoLink } = row;
    
      // Ensure idTele is defined before proceeding
      if (!idTele) {
        console.log('idTele is missing, skipping this row.');
        continue;
      }
    
      const existingUser = await prisma.data_user.findUnique({
        where: { idTele: idTele },
      });
    
      if (existingUser) {
        const devisiExists = await prisma.data_devisi.findUnique({
          where: { namaDevisi: devisi },
        });
    
        if (!devisiExists && devisi) {
          console.log(`Devisi '${devisi}' does not exist in data_devisi.`);
          continue;
        }
    
        const subDevisiExists = await prisma.data_sub_devisi.findUnique({
          where: { namaSubDevisi: subDevisi },
        });
    
        if (!subDevisiExists && subDevisi) {
          console.log(`SubDevisi '${subDevisi}' does not exist in data_sub_devisi.`);
          continue;
        }
    
        await prisma.data_user.update({
          where: { idTele: idTele },
          data: {
            timestamp: timestamp,
            email: email,
            nama: nama,
            telepon: telepon,
            devisi: devisi || null,
            subDevisi: subDevisi || null,
            videoLink: videoLink,
          },
        });
    
        continue;
      }
    
      const password = generateRandomPassword();
    
      const devisiExists = await prisma.data_devisi.findUnique({
        where: { namaDevisi: devisi },
      });
    
      const subDevisiExists = await prisma.data_sub_devisi.findUnique({
        where: { namaSubDevisi: subDevisi },
      });
    
      await prisma.data_user.create({
        data: {
          timestamp: timestamp,
          idTele: idTele,
          email: email,
          nama: nama,
          telepon: telepon,
          password: password,
          devisi: devisiExists ? devisi : null,
          subDevisi: subDevisiExists ? subDevisi : null,
          videoLink: videoLink,
        },
      });
    
      await sendEmail(idTele, email, password);
    }    
  } catch (error) {
    console.error('Error updating the database from Google Sheets:', error);
  }
}



module.exports = {
  updateDatabaseFromSheet,
};

console.log('Sudah di run');

