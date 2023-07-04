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
  // const [exp0,setExp0]= useState([])
  // const [exp1,setExp1]= useState([])
  // const [exp2,setExp2]= useState([])
  // const [exp3,setExp3]= useState([])
  const [optionVal,setOptVal]= useState('All')
  
  
  function sameDataExist(arr,data,func){
    for (let i = 0; i < arr.length; i++) {
      // Assuming 'data' is a single value that needs to be compared
      if (arr[i].Symbol === data.Symbol) {
        console.log(i,data);
        func(prev=>prev[i]=data) // Same data found in the array
        return true;
      }
    }
    return false
  }
  useEffect(() => {
    const socket = io(SERVER_HOST);
    socket.on('connect', () => {
      console.log('Connected to the socket');
    });
    
    // Receive data from the server
    socket.on('data', (data) => {
      // if(data.Option===""){
      //   console.log(data);
      // }
      // console.log(data);
      
      if(data.Index === sbl[0] ){
        const obj =allbanksData.find((o,i) => {
          if(o.Symbol === data.Symbol)
          {
            setAllbanksData(prev=>prev[i]=data)
            
          }
          

        })
        
        // var check = sameDataExist(allbanksData,data,setAllbanksData)
        if(obj===undefined){
          
          setAllbanksData(prevData => [...prevData,data])
          
          // if(data.Expiry_Date !== ''){
          //   setExp0(prev=> [...prev,data.Expiry_Date]);
          //   setExp0(prev =>[...new Set(prev)]);
          //   // console.log(exp0);
          // }
        }

        

      }else if(data.Index === sbl[1] ){
        const obj =mainIdxData.find((o,i) => {
          if(o.Symbol === data.Symbol)
          {
            setMainIdxData(prev=>prev[i]=data)
            
          }
          

        })
        // var check = sameDataExist(mainIdxData,data,setMainIdxData)
        if(obj===undefined){
        setMainIdxData(prevData => [...prevData,data])
        // if(data.Expiry_Date !== ''){
        //   setExp1(prev=> [...prev,data.Expiry_Date]);
        //   setExp1(prev =>[...new Set(prev)]);
        }
      // }
        // console.log(data.Index);
        // console.log(exp1.slice(0,exp1.length-1));

      }else if(data.Index === sbl[2] ){
        // var check = sameDataExist(finData,data,setFinData)
        const obj =finData.find((o,i) => {
          if(o.Symbol === data.Symbol)
          {
            setFinData(prev=>prev[i]=data)
            
          }
          

        })
        if(obj===undefined){
        setFinData(prevData => [...prevData,data])
        // console.log(finData);
        // if(data.Expiry_Date !== ''){

        //   setExp2(prev=> [...prev,data.Expiry_Date]);
        //   setExp2(prev =>[...new Set(prev)]);
        // }
      }

        // console.log(exp2);
      }else if(data.Index === sbl[3] ){
        // var check = sameDataExist(midCapsData,data,setMidCapsData)
        const obj =midCapsData.find((o,i) => {
          if(o.Symbol === data.Symbol)
          {
            setMidCapsData(prev=>prev[i]=data)
            
          }
          

        })
        if(obj===undefined){
        setMidCapsData(prevData => [...prevData,data])
        // if(data.Expiry_Date !== ''){

        //   setExp3(prev=> [...prev,data.Expiry_Date]);
        //   setExp3(prev =>[...new Set(prev)]);
        // }
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
    
    
    setOptVal("All")
    
  };
  const handleExpiry = (e) => {
    const { value} = e.target;
    setExpiry(value)
  };
  
  const handleOption = (e) => {
    const { value} = e.target;
    setOptVal(value)
    // if(value!=='All'){
    //   setFil(propsData.filter(data=>data.Option===value))
      
    // }else{
    //   setFil(propsData)
    // }
    console.log(value,filteredData);
  };
  useEffect(()=>{
    console.log("Alll banks",allbanksData.length);
    console.log("2: ",mainIdxData.length);
    console.log("3: ",finData.length);
    console.log("4: ",midCapsData.length);
    if(symbol===sbl[0]){
      setProps(allbanksData)
      setFil(allbanksData)
    }
    else if(symbol===sbl[1]){
      setProps(mainIdxData)
      setFil(mainIdxData)
    }else if(symbol===sbl[2]){
      setProps(finData)
      setFil(finData)
    }
    else if(symbol===sbl[3]){
      setProps(midCapsData)
      setFil(midCapsData)
    }
    // if(optionVal==='All'){

    // }else{
    //   if(symbol===sbl[0]){
    //     setProps(allbanksData)
    //     setFil(propsData.filter(data=>data.Option===optionVal))
    //   }
    //   else if(symbol===sbl[1]){
    //     setProps(mainIdxData)
    //     setFil(propsData.filter(data=>data.Option===optionVal))
    //   }else if(symbol===sbl[2]){
    //     setProps(finData)
    //     setFil(propsData.filter(data=>data.Option===optionVal))
    //   }
    //   else if(symbol===sbl[3]){
    //     setProps(midCapsData)
    //     setFil(propsData.filter(data=>data.Option===optionVal))
    //   }
    // }
  },[allbanksData,mainIdxData,finData,midCapsData,symbol])

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
      {/* <FormControl  sx={{ minWidth: 150 }}>
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
      </FormControl> */}


        </div>
        <div className='content'>
        {/* (optionVal==="All")?propsData:filteredData */}
            <Data2 propData = {propsData}/>
        </div>
    </div>
  )
}