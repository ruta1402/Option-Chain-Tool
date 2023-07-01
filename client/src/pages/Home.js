import React from 'react'
import Data from '../components/Data'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import './styles/home.css';
export default function Home() {
    const [symbol, setSymbol] = React.useState('');

    const [expiry ,setExpiry] = React.useState('');
    const [prize ,setPrize] = React.useState(null);

  const handleSybl = (e) => {
    const { value} = e.target;
    setSymbol(value)
  };
  const handleExpiry = (e) => {
    const { value} = e.target;
    setExpiry(value)
  };
  const handlePrize = (e) => {
    const { value} = e.target;
    setPrize(value)
  };

  const sbl = [
    "AAR",
    "BBR",
    "ARB",
    "OXC"
];
const expiry_date =[
    "06-Jul-2023",
    "13-Jul-2023",
    "20-Jul-2023",
    "26-Jul-2023",
    "30-Jul-2023",
]
const prizes = [
    17220, 45012, 41110
]
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
      <FormControl  sx={{ minWidth: 150 }}>
        <InputLabel id="Exp_dt">Expiry Date</InputLabel>
        <Select
          labelId="Exp_dt"
          id="expiry"
          value={expiry}
          label="Expiry Date"
          onChange={handleExpiry}
        >
          {expiry_date.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
          
        </Select>
      </FormControl>


      {/* //For Strike Price */}
      <FormControl  sx={{ minWidth: 150 }}>
        <InputLabel id="prize-label">Strike Prize</InputLabel>
        <Select
          labelId="prize-label"
          id="st_prize"
          value={prize}
          label="Strike Prize"
          onChange={handlePrize}
        >
          {prizes.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>


        </div>
        <div className='content'>
            <Data/>
        </div>
    </div>
  )
}
