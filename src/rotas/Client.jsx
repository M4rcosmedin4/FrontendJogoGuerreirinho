import React, { useEffect,useState } from 'react';
import Nav from '../components/Nav';
import { Outlet } from 'react-router-dom';
import { useGame } from '../GameContext';

const Client = () => {

const [atulizar,setAtualizar]=useState(false)
const { isGameRunning } = useGame();



useEffect(()=>{
  setTimeout(()=>{
    setAtualizar(true)
  },1000)
  
},[])

useEffect(()=>{
  setAtualizar(false)

},[isGameRunning])


  return (
    <div>
      {atulizar &&<Nav/>}
      <Outlet /> 
     
    </div>
  );
};

export default Client;