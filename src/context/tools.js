import { ethers } from "ethers"


export const getWeiFromEther = (_ether) => {
    return ethers.utils.parseEther(String(_ether)).toString();
  
}
export const getEtherFromWei = (_wei) => {
    return ethers.utils.formatEther(String(_wei)).toString();
  
}
