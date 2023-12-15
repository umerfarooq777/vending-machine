
import React, { createContext, useContext, useEffect, useState } from 'react';
import { VM_ABI, VM_ADDRESS } from './data';
import { ethers } from 'ethers';

const VMContext = createContext();
const { ethereum } = window;

const VMContextProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [currentAccount, setCurrentAccount] = useState();
    const [ownerAddress, setOwnerAddress] = useState();
    const [contractETHBal, setContractETHBal] = useState("0");
    const [isVMpaused, setIsVMpaused] = useState(false);
    const [contractState, setContractState] = useState({
        lays:'0',
        pizza:'0',
        donut:'0',
        drink:'0',
    });
    const [userData, setUserData] = useState({
        lays:'0',
        pizza:'0',
        donut:'0',
        drink:'0',
    });


    useEffect(() => {
        checkIsWalletConnected();
      
    }, [])

    ethereum.on("accountsChanged", async(account) => {
        setCurrentAccount(account[0]?.toLowerCase());
     
    })

    const checkIsWalletConnected = async () => {
        try {
            if (!ethereum) return alert("please install MetaMask");
            const accounts = await ethereum.request({ method: "eth_accounts" });
            if (accounts.length) {
                setCurrentAccount(accounts[0]?.toLowerCase());
                console.log("Account", accounts[0]?.toLowerCase())
            } else {
                console.log("No account Found");
            }
        } catch (err) {
            console.log(err);
        }
    }



    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please install Metamask");
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            setCurrentAccount(accounts[0]?.toLowerCase());

        } catch (err) {
            console.log(err);
        }
    }

  const getVMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const vendingMachineContract = new ethers.Contract(VM_ADDRESS, VM_ABI, signer);
    // console.log(vendingMachineContract);
    return vendingMachineContract;
}
  const getVMContractBalance = async () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const balanceWei = await provider.getBalance(VM_ADDRESS);
    setContractETHBal(balanceWei.toString())
}

//! ========== READS ======================

const getContractState = async () => {
    const pauseState =  await getVMContract().paused();
    setIsVMpaused(pauseState)
    const owner =  await getVMContract().owner();
    setOwnerAddress(owner?.toLowerCase())
    
    
    const laysBal =  await getVMContract().getLaysBalance();
    const pizzaBal =  await getVMContract().getPizzaBalance();
    const donutBal =  await getVMContract().getDonutBalance();
    const drinkBal =  await getVMContract().getDrinksBalance();
    
    
    setContractState({
        lays:laysBal.toString(),
        pizza:pizzaBal.toString(),
        donut:donutBal.toString(),
        drink:drinkBal.toString(),
    })
    await getVMContractBalance();
    
}
const getUserBalance = async (userAddres) => {
    if (!userAddres) {
        return
    }
    
    
    const userBalances =  await getVMContract().Balances(userAddres);
    // console.log("userBalances",userBalances);
   
    
    setUserData({
        lays:userBalances?.Lays?.toString(),
        pizza:userBalances?.Pizza?.toString(),
        donut:userBalances?.Donut?.toString(),
        drink:userBalances?.Drinks?.toString(),
    })
    
}

//! ========== WRITES NON PAYABLE ======================

const restockLays = async(newStock,callBack) => {
    try{
        setIsLoading(true)
        var tx = await getVMContract().restockLays(String(newStock))
        await tx.wait();
        callBack(0);
        await getContractState();
        setIsLoading(false)
        return true;
    }catch(err){
        setIsLoading(false)
        console.log(err);
        return false;
    }
}
const restockPizza = async(newStock,callBack) => {
    try{
        setIsLoading(true)

        var tx = await getVMContract().restockPizza(String(newStock))
        await tx.wait();
        callBack(0);
        await getContractState();
        setIsLoading(false)
        
        return true;
    }catch(err){
        console.log(err);
        setIsLoading(false)
        return false;
    }
}
const restockDonut = async(newStock,callBack) => {
    try{
        setIsLoading(true)

        var tx = await getVMContract().restockDonut(String(newStock))
        await tx.wait();
        callBack(0);
        await getContractState();
        setIsLoading(false)
        
        return true;
    }catch(err){
        console.log(err);
        setIsLoading(false)
        return false;
    }
}
const restockDrinks = async(newStock,callBack) => {
    try{
        setIsLoading(true)

        var tx = await getVMContract().restockDrinks(String(newStock))
        await tx.wait();
        callBack(0);
        await getContractState();
        setIsLoading(false)
        
        return true;
    }catch(err){
        setIsLoading(false)
        console.log(err);
        return false;
    }
}
const pauseVM = async() => {
    try{
        setIsLoading(true)
        
        var tx = await getVMContract().pause()
        await tx.wait();
        await getContractState();
        setIsLoading(false)
        return true;
    }catch(err){
        console.log(err);
        setIsLoading(false)
        return false;
    }
}
const unpauseVM = async() => {
    try{
        setIsLoading(true)
        
        var tx = await getVMContract().unpause()
        await tx.wait();
        await getContractState();
        setIsLoading(false)
        return true;
    }catch(err){
        console.log(err);
        setIsLoading(false)
        return false;
    }
}
const withdrawMoney = async() => {
    try{
        setIsLoading(true)
        
        var tx = await getVMContract().withdrawMoney()
        await tx.wait();
        await getContractState();
        setIsLoading(false)
        return true;
    }catch(err){
        setIsLoading(false)
        console.log(err);
        return false;
    }
}

//!=============== WRITES PAYABLE =====================
const PurchaseLays = async(amount) => {
    try{
        setIsLoading(true)
        
        const ethPrice = await getVMContract().getPriceForOnePiece(0)
        var tx = await getVMContract().PurchaseLays(amount,{value:ethPrice.toString()})
        await tx.wait();
        await getContractState();
        await getUserBalance(currentAccount)
        setIsLoading(false)
        return true;
    }catch(err){
        console.log(err);
        setIsLoading(false)
        return false;
    }
}
const PurchasePizza = async(amount) => {
    try{
        setIsLoading(true)

        const ethPrice = await getVMContract().getPriceForOnePiece(1)
        var tx = await getVMContract().PurchasePizza(amount,{value:ethPrice.toString()})
        await tx.wait();
        await getContractState();
        await getUserBalance(currentAccount)
        setIsLoading(false)

        return true;
    }catch(err){
        console.log(err);
        setIsLoading(false)

        return false;
    }
}
const PurchaseDonuts = async(amount) => {
    try{
        setIsLoading(true)

        const ethPrice = await getVMContract().getPriceForOnePiece(2)
        var tx = await getVMContract().PurchaseDonuts(amount,{value:ethPrice.toString()})
        await tx.wait();
        await getContractState();
        await getUserBalance(currentAccount)
        setIsLoading(false)

        return true;
    }catch(err){
        console.log(err);
        setIsLoading(false)

        return false;
    }
}
const PurchaseDrinks = async(amount) => {
    try{
        setIsLoading(true)

        const ethPrice = await getVMContract().getPriceForOnePiece(3)
        var tx = await getVMContract().PurchaseDrinks(amount,{value:ethPrice.toString()})
        await tx.wait();
        await getContractState();
        await getUserBalance(currentAccount)
        setIsLoading(false)

        return true;
    }catch(err){
        console.log(err);
        setIsLoading(false)

        return false;
    }
}


  const CONTEXT_VALUES = {
    isLoading,
    contractETHBal,
    currentAccount,
    connectWallet,
    getContractState,
    contractState,
    ownerAddress,
    isVMpaused,
    getUserBalance,
    userData,
    //!======== WRITES NON PAYABLE =================
    restockLays,
    restockPizza,
    restockDonut,
    restockDrinks,
    pauseVM,
    unpauseVM,
    withdrawMoney,
    //!======== WRITES PAYABLE =================
    PurchaseLays,
    PurchasePizza,
    PurchaseDrinks,
    PurchaseDonuts,
    

    }

  return (
    <VMContext.Provider value={CONTEXT_VALUES}>
      {children}
    </VMContext.Provider>
  );
};

const GetVMContext = () => {    
    return useContext(VMContext)

}

export { VMContext, VMContextProvider,GetVMContext };