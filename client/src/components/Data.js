import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid';




const columns = [
    { field: 'OI1', headerName: 'OI', maxWidth: 70,type: 'number', },
    {
      field: 'ChangeInOI1',
      headerName: 'CHNG IN OI',
      type: 'number',
      maxWidth: 100,
    },
    {
      field: 'volume1',
      headerName: 'Volume',
      type: 'number',
      maxWidth: 100,
    },
    {
      field: 'IV1',
      headerName: 'IV',
      type: 'number',
      maxWidth: 70,
    },
    {
      field: 'LTP1',
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
      field: 'BIDQTY1',
      headerName: 'BID QTY',
      type: 'number',
      maxWidth: 110,
    },
    {
      field: 'BID1',
      headerName: 'BID',
      type: 'number',
      maxWidth: 110,
    },
    {
      field: 'ASK1',
      headerName: 'ASK',
      type: 'number',
      maxWidth: 110,
    },
    {
      field: 'ASKQTY1',
      headerName: 'ASK QTY',
      type: 'number',
      maxWidth: 110,
    },
    ,{
      field: 'STRIKE',
      headerName: 'STRIKE',
      type: 'number',
      maxWidth: 110,
    },


    {
      field: 'BIDQTY2',
      headerName: 'BID QTY',
      type: 'number',
      maxWidth: 110,
    },
    {
      field: 'BID2',
      headerName: 'BID',
      type: 'number',
      maxWidth: 110,
    },
  {
      field: 'ASK2',
      headerName: 'ASK2',
      type: 'number',
      maxWidth: 110,
    },

    {
      field: 'ASKQTY2',
      headerName: 'ASK QTY',
      type: 'number',
      maxWidth: 110,
    },
    {
      field: 'CHNG2',
      headerName: 'CHNG',
      type: 'number',
      maxWidth: 110,
    },
    {
      field: 'LTP2',
      headerName: 'LTP',
      type: 'number',
      maxWidth: 110,
    },
    {
      field: 'IV2',
      headerName: 'IV',
      type: 'number',
      maxWidth: 70,
    },
    {
      field: 'volume2',
      headerName: 'Volume',
      type: 'number',
      maxWidth: 100,
    },
    {
      field: 'ChangeInOI2',
      headerName: 'CHNG IN OI',
      type: 'number',
      maxWidth: 100,
    },
    { field: 'OI2', headerName: 'OI', maxWidth: 70,type: 'number', },
  ];
  
  const rows = [
    { id: 1, OI1: 'Snow', firstName: 'Jon', age: 35 },
    { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
    { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
    // { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
    // { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
    // { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
    // { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
    // { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
    // { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
  ];
  
  const columnGroupingModel = [
    {
      groupId: 'CALLS',
      description: '',
      headerAlign: 'center',
      children: [
        {field:"OI1"},
       {field:"ChangeInOI1"},
       {field:"volume1"},
       {field:"IV1"},
       {field:"LTP1"},
       {field:"CHNG1"},
       {field:"BIDQTY1"},
       {field:"BID1"},
       {field:"ASK1"},
       {field:"ASKQTY1"},
      ],
    },
    {
      groupId: 'PUTS',
      headerAlign: 'center',
      children: [
       {field:"STRIKE"},
       {field:"BIDQTY2"},
       {field:"BID2"},
       {field:"ASK2"},
       {field:"ASKQTY2"},
       {field:"CHNG2"},
       {field:"LTP2"},
       {field:"IV2"},
       {field:"volume2"},
       {field:"ChangeInOI2"},
       {field:"OI2"},
       
      ],
    },
  ];
export default function Data({propData}) {
  console.log(propData.length);
  const [rows ,setRows]= useState([])
  useEffect(()=>{
    setRows(propData)
    // propData.map((data,index)=>{
    //   console.log(index)
    //   if(data.option==="Put"){
    //     var row = {
          
    //       "STRIKE": data.Strike_Price,
    //       "BIDQTY2":data.Best_Bid_Quantity,
    //      "BID2":data.Best_Bid,
    //      "ASK2":data.Best_Ask,
    //      "ASKQTY2":"-",
    //      "CHNG2":'-',
    //      "LTP2":data.Last_Traded_Price,
    //      "IV2":"-",
    //      "volume2":data.Total_Traded_Volume,
    //      "ChangeInOI2":data.Change_in_OI,
    //      "OI2":data.Open_Interest
    //     }
    //   }
    //   setRows([...rows,row])
    // });
  },[propData])
  
  return (
    <div className='mainpage' style={{display:'flex', justifyContent: 'center', alignItems: 'center'}}>
    <div style={{ height: '100vh', width: '100%' }}>
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
        columnGroupingModel={columnGroupingModel}
      />
    </div>

    </div>
  )
}
