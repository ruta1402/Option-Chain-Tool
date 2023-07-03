import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';




const columns = [
    { field: 'Index', headerName: 'Symbol', maxWidth: 110 },
    { field: 'Open_Interest', headerName: 'OI', maxWidth: 70,type: 'number', },
    {
      field: 'Change_in_OI',
      headerName: 'CHNG IN OI',
      type: 'number',
      maxWidth: 100,
    },
    {
      field: 'Total_Traded_Volume',
      headerName: 'Volume',
      type: 'number',
      maxWidth: 100,
    },
    {
      field: 'Implied_Volatility',
      headerName: 'IV',
      type: 'number',
      maxWidth: 70,
    },
    {
      field: 'Last_Traded_Price',
      headerName: 'LTP',
      type: 'number',
      maxWidth: 110,
    },
    {
      field: 'CHNG1',
      headerName: 'CHNG',
      type: 'number',
      maxWidth: 110,
    }
    ,{
      field: 'Best_Bid_Quantity',
      headerName: 'BID QTY',
      type: 'number',
      maxWidth: 110,
    },
    {
      field: 'Best_Bid',
      headerName: 'BID',
      type: 'number',
      maxWidth: 110,
    },
    {
      field: 'Best_Ask',
      headerName: 'ASK',
      type: 'number',
      maxWidth: 110,
    },
    {
      field: 'Best_Ask_Quantity',
      headerName: 'ASK QTY',
      type: 'number',
      maxWidth: 110,
    },
    ,{
      field: 'Strike_Price',
      headerName: 'STRIKE',
      type: 'number',
      maxWidth: 110,
    },
    {
        field: 'Expiry_Date',
        headerName: 'Expiry Date',
        
        maxWidth: 110,
      },
      {
        field: 'Option',
        headerName: 'Option',
        
        maxWidth: 110,
      },


    
  ];
  
//   const rows = [
//     { id: 1, OI1: 'Snow', firstName: 'Jon', age: 35 },
//     { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//     { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//     // { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//     // { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//     // { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//     // { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//     // { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//     // { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
//   ];
  
  
export default function Data2({propData}) {
  // console.log(propData);
  const [rows ,setRows]= useState([])
  useEffect(()=>{
    setRows(propData)
    
  },[propData])
  
  return (
    <div className='mainpage' style={{display:'flex', justifyContent: 'center', alignItems: 'center'}}>
    <div style={{ height: '100vh', width: '80%' }}>
      <DataGrid
      sx={{
        boxShadow: 2,
        border: 2,
        
        '& .MuiDataGrid-cell:hover': {
          color: 'primary.main',
        },
      }}
        experimentalFeatures={{ columnGrouping: true }}
        rows={rows}
        columns={columns}
        rowHeight={50}
        disableRowSelectionOnClick
        
      />
    </div>

    </div>
  )
}