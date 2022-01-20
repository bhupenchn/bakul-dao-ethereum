import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";

const tokenModule = sdk.getTokenModule("0x42Ad364E62Ab4E264619C3d1974Dbc66716eeC2B");

(async() => {
    try {
        const amount = 1_000_000;
        // use the util function from ethers to convert the amount to have 18 decimals that is the standard
        const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18);
        // interact with the deployed ERC-20 contract and mint tokens
        await tokenModule.mint(amountWith18Decimals);
        const totalSupply = await tokenModule.totalSupply();

        // print total supply
        console.log("There is now ", ethers.utils.formatUnits(totalSupply, 18), " $BAKUL in circulation");
    } catch(error) {
        console.error("Failed to print money", error);
    }
})();