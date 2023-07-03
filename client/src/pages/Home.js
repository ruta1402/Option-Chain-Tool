import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Data from '../components/Data'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import './styles/home.css';
import Data2 from '../components/Data2';
export default function Home() {
  const SERVER_HOST = 'http://localhost:8989';
  const sbl = [
    "ALLBANKS",
    "MAINIDX",
    "FINANCIALS",
    "MIDCAPS"
];
  
  const [allbanksData,setAllbanksData] = useState([])
  const [mainIdxData,setMainIdxData] = useState([])
  const [finData,setFinData] = useState([])
  const [midCapsData,setMidCapsData] = useState([])
  const [exp0,setExp0]= useState([])
  const [exp1,setExp1]= useState([])
  const [exp2,setExp2]= useState([])
  const [exp3,setExp3]= useState([])
  const [optionVal,setOptVal]= useState('All')
  
  useEffect(() => {
    const socket = io(SERVER_HOST);
    socket.on('connect', () => {
      console.log('Connected to the socket');
    });
    
    // Receive data from the server
    socket.on('data', (data) => {
      console.log(data);
      if(data.Index === sbl[0] ){
        setAllbanksData(prevData => [...prevData,data])
        if(data.Expiry_Date !== ''){
          setExp0(prev=> [...prev,data.Expiry_Date]);
          setExp0(prev =>[...new Set(prev)]);
          // console.log(exp0);
        }

        

      }else if(data.Index === sbl[1] ){
        setMainIdxData(prevData => [...prevData,data])
        if(data.Expiry_Date !== ''){
          setExp1(prev=> [...prev,data.Expiry_Date]);
          setExp1(prev =>[...new Set(prev)]);
        }
        // console.log(data.Index);
        // console.log(exp1.slice(0,exp1.length-1));

      }else if(data.Index === sbl[2] ){
        setFinData(prevData => [...prevData,data])
        // console.log(finData);
        if(data.Expiry_Date !== ''){

          setExp2(prev=> [...prev,data.Expiry_Date]);
          setExp2(prev =>[...new Set(prev)]);
        }

        // console.log(exp2);
      }else if(data.Index === sbl[3] ){
        console.log(data);
        setMidCapsData(prevData => [...prevData,data])
        if(data.Expiry_Date !== ''){

          setExp3(prev=> [...prev,data.Expiry_Date]);
          setExp3(prev =>[...new Set(prev)]);
        }

        // console.log(exp3);
      }
      // Process the received data
    });

    // Clean up the socket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);
    
  const [symbol, setSymbol] = React.useState('');
    const [expiry ,setExpiry] = React.useState('');
    const [propsData,setProps] = React.useState([])
    const [filteredData,setFil] = React.useState(propsData) ;
  const handleSybl = (e) => {
    const { value} = e.target;
    setSymbol(value);
    
    if(value===sbl[0]){
      setProps(allbanksData)
      setFil(allbanksData)
    }
    else if(value===sbl[1]){
      setProps(mainIdxData)
      setFil(mainIdxData)
    }else if(value===sbl[2]){
      setProps(finData)
      setFil(finData)
    }
    else if(value===sbl[3]){
      setProps(midCapsData)
      setFil(midCapsData)
    }
    
    setOptVal("All")
    
  };
  const handleExpiry = (e) => {
    const { value} = e.target;
    setExpiry(value)
  };
  
  const handleOption = (e) => {
    const { value} = e.target;
    setOptVal(value)
    if(value!=='All'){
      setFil(propsData.filter(data=>data.Option===value))
      
    }else{
      setFil(propsData)
    }
    console.log(value,filteredData);
  };


  return (
    <div className='home_page'>
        <div className='filters'>

        {/* Symobls */}
        <FormControl   sx={{  minWidth: 120 }}>
        <InputLabel id="Symbol">Symbols</InputLabel>
        <Select
          labelId="Symbol"
          id="Syl"
          value={symbol}
          label="Symbol"
          onChange={handleSybl}
        >
            {sbl.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
          
        </Select>
      </FormControl>


      {/* // For Expiry Date */}
      


      {/* //For Strike Price */}
      <FormControl  sx={{ minWidth: 150 }}>
        <InputLabel id="option">Option Type</InputLabel>
        <Select
          labelId="option"
          id="opt"
          value={optionVal}
          label="Option Type"
          onChange={handleOption}
        >
          {["All",'call','put'].map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>


        </div>
        <div className='content'>
        {/* (optionVal==="All")?propsData:filteredData */}
            <Data2 propData = {filteredData}/>
        </div>
    </div>
  )
}