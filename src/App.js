import logo from './logo.svg';
import './App.css';
import { GetVMContext } from './context/VMContext';
import { useEffect, useState } from 'react';
import { getEtherFromWei } from './context/tools';

function App() {

  const {
    isLoading,
    currentAccount,
    connectWallet,
    contractState,
    getContractState,
    ownerAddress,
    getUserBalance,
    unpauseVM,
    pauseVM,
    isVMpaused,
    withdrawMoney,
    restockLays,
    restockPizza,
    restockDonut,
    restockDrinks,
    userData,
    PurchaseLays,
    PurchasePizza,
    PurchaseDrinks,
    PurchaseDonuts,
    contractETHBal
    } = GetVMContext()


  const getData = async () => {
    await getContractState()
    await getUserBalance(currentAccount)
  }
  useEffect(() => {
    if (currentAccount) {
      getData()
      // console.log(contractState);
    }
   
  }, [currentAccount])
  useEffect(() => {
    if (ownerAddress) {
      // console.log(ownerAddress);
    }
   
  }, [ownerAddress])


  

  const [laysRestokeAmount, setlaysRestokeAmount] = useState('')
  const [pizzaRestokeAmount, setpizzaRestokeAmount] = useState('')
  const [donutRestokeAmount, setdonutRestokeAmount] = useState('')
  const [drinkRestokeAmount, setdrinkRestokeAmount] = useState('')
  
  
  return (
    <div className="App">
      <header>
        {
          !currentAccount?
          <>
        <h2> Please Connect Your Crypto Wallet</h2>
        <button onClick={connectWallet} >Connect Wallet</button>
        </>
          :
          <>
          

          <p>Connected Wallet: {currentAccount}</p>

          <div>

            <p> Lays Left: {contractState?.lays}</p>
            <p> Pizza Left: {contractState?.pizza}</p>
            <p> Donut Left: {contractState?.donut}</p>
            <p> Drink Left: {contractState?.drink}</p>
          </div>

          <h3> Snacks You Have</h3>
          <div>

            <p> Lays : {userData?.lays}</p>
            <p> Pizza : {userData?.pizza}</p>
            <p> Donut : {userData?.donut}</p>
            <p> Drink : {userData?.drink}</p>
          </div>
{
  isVMpaused
  ?
  <h3>Vending Machine Is Paused</h3>
  :
  <>
<button disabled={isLoading} onClick={()=>PurchaseLays(1)} >BUY 1 LAYS</button>
<button disabled={isLoading} onClick={()=>PurchasePizza(1)} >BUY 1 PIZZA</button>
<button disabled={isLoading} onClick={()=>PurchaseDonuts(1)} >BUY 1 DONUT</button>
<button disabled={isLoading} onClick={()=>PurchaseDrinks(1)} >BUY 1 DRINK</button>

  </>
}

          





          {
            (ownerAddress && (ownerAddress === currentAccount)) &&
            
            <>
            <h2>Admin Section</h2>
            <div>
              <input type='number' min={0} value={laysRestokeAmount} onChange={(e)=>setlaysRestokeAmount(e.target.value)}/>
              <button disabled={!laysRestokeAmount || isLoading ||Number(laysRestokeAmount)<=0} onClick={()=>restockLays(laysRestokeAmount)} >RESTOKE LAYS</button>
            </div>
            <div>
              <input type='number' min={0} value={pizzaRestokeAmount} onChange={(e)=>setpizzaRestokeAmount(e.target.value)}/>
              <button disabled={!pizzaRestokeAmount || isLoading ||Number(pizzaRestokeAmount)<=0} onClick={()=>restockPizza(pizzaRestokeAmount)} >RESTOKE PIZZA</button>
            </div>
            <div>
              <input type='number' min={0} value={donutRestokeAmount} onChange={(e)=>setdonutRestokeAmount(e.target.value)}/>
              <button disabled={!donutRestokeAmount || isLoading ||Number(donutRestokeAmount)<=0} onClick={()=>restockDonut(donutRestokeAmount)} >RESTOKE DONUT</button>
            </div>
            <div>
              <input type='number' min={0} value={drinkRestokeAmount} onChange={(e)=>setdrinkRestokeAmount(e.target.value)}/>
              <button disabled={!drinkRestokeAmount || isLoading ||Number(drinkRestokeAmount)<=0} onClick={()=>restockDrinks(drinkRestokeAmount)} >RESTOKE DRINKS</button>
            </div>
           
            <button disabled={isLoading || (Number(getEtherFromWei(contractETHBal))<=0)} onClick={withdrawMoney} >Withdraw Sales {Number(getEtherFromWei(contractETHBal))}</button>

            {
              isVMpaused?
              
              <button disabled={isLoading} onClick={unpauseVM} >Resum VM</button>
              :              
              <button  disabled={isLoading} onClick={pauseVM} >Pause Vm</button>

            }
            
            </>
          }
          


          
          
          
          </>
        }
       
      </header>
    </div>
  );
}

export default App;
