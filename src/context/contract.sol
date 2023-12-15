//SPDX-License-Identifier: MIT
pragma solidity 0.8.20;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

error Invalid_Price();

contract VendingMachine3 is Ownable {

    using SafeMath for uint256;

    struct Items {
        uint256 Lays;
        uint256 Pizza;
        uint256 Donut;
        uint256 Drinks;
    }

    uint256[] goodsPrice = [1000000000000,2000000000000,3000000000000,4000000000000];
    //uint256[] goodsPrice = [lays:0.000001 eth, Pizza:0.000002 eth, Donut:0.000003 eth, Drink:0.000004 eth,];

    mapping (address => Items) public Balances;
    Items internal items;
    bool public paused;
    uint256 private extra;

    modifier whenPaused {
        require (!paused);
        _;
    }

    constructor ()  Ownable(_msgSender()){
        items.Donut = 100;
        items.Drinks = 100;
        items.Lays = 100;
        items.Pizza = 100;
    }
    

    function getLaysBalance () public view returns (uint256) {
        return items.Lays;
    }

    function getPizzaBalance () public view returns (uint256) {
        return items.Pizza;
    }

    function getDonutBalance () public view returns (uint256) {
        return items.Donut;
    }
    function getDrinksBalance () public view returns (uint256) {
        return items.Drinks;
    }

    function restockPizza (uint256 value) public onlyOwner {
        items.Pizza += value;
    }

    function restockLays (uint256 value) public onlyOwner {
        items.Lays += value;
    }

    function restockDrinks (uint256 value) public onlyOwner {
        items.Drinks += value;
    }

    function restockDonut (uint256 value) public onlyOwner {
        items.Donut += value;
    }

    function PurchaseDonuts (uint256 amount) public payable whenPaused {
        require(items.Donut > amount, "Not enough donuts in stock");
        require(amount == 1, "You can only buy 1 at a time !");
        require (msg.value >= amount * getPriceForOnePiece(2), "You must pay ether per donut");
        if (msg.value > amount * getPriceForOnePiece(2)) {
            extra = msg.value - amount * getPriceForOnePiece(2);
            (bool success, ) = payable(msg.sender).call{value : extra}("");
            require (success, "Failed to send remains !");
        }

        unchecked {
            items.Donut -= amount;
            Balances[msg.sender].Donut += amount;
        }
    }

    function PurchaseLays (uint256 amount) public payable whenPaused {
        require(items.Lays > amount, "Not enough pizza in stock");
        require(amount == 1, "You can only buy one at a time !");
        require (msg.value >= amount * getPriceForOnePiece(0), "You must pay ether per lays");
        if (msg.value > amount * getPriceForOnePiece(0)) {
            extra = msg.value - amount * getPriceForOnePiece(0);
            (bool success, ) = payable(msg.sender).call{value : extra}("");
            require (success, "Failed to send remains !");
        }
        unchecked {
            items.Lays -= amount;
            Balances[msg.sender].Lays += amount;
        }
    }

    function PurchasePizza (uint256 amount) public payable whenPaused {
        require(items.Pizza > amount, "Not enough pizza in stock");
        require(amount == 1, "You can only buy one at a time !");
        require (msg.value >= amount * getPriceForOnePiece(1), "You must pay ether per pizza");
        if (msg.value > amount * getPriceForOnePiece(1)) {
            extra = msg.value - amount * getPriceForOnePiece(1);
            (bool success, ) = payable(msg.sender).call{value : extra}("");
            require (success, "Failed to send remains !");
        }

        unchecked {
            items.Pizza -= amount;
            Balances[msg.sender].Pizza += amount;
        }
    }

    function PurchaseDrinks (uint256 amount) public payable whenPaused {
        require(items.Drinks > amount, "Not enough Drinks in stock");
        require(amount == 1, "You can only buy one at a time !");
        require (msg.value >= amount*getPriceForOnePiece(3), "You must pay ether per drink");
        if (msg.value > amount * getPriceForOnePiece(3)) {
            extra = msg.value - amount * getPriceForOnePiece(3);
            (bool success, ) = payable(msg.sender).call{value : extra}("");
            require (success, "Failed to send remains !");
        }

        unchecked {
            items.Drinks -= amount;
            Balances[msg.sender].Drinks += amount;
        }
    }

    function withdrawMoney () public onlyOwner {
        require (address(this).balance > 0, "Not enough funds !");
        (bool success ,) = _msgSender().call{value : address(this).balance}("");
        require(success, "Not Able To Transfer Funds !");
    }

    function pause () public onlyOwner {
        paused = true;
    }

    function unpause () public onlyOwner {
        paused = false;
    }
    
    function getPriceForOnePiece(uint256 itemCode) public view returns (uint256) {
        require(itemCode>=0 && itemCode<4);
        return goodsPrice[itemCode];
    }
}