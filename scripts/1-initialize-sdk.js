import { ThirdwebSDK } from "@3rdweb/sdk";
import ethers from 'ethers';

// to import env file
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY == "") {
    console.log("Private key not found");
}


if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL == "") {
    console.log("🛑 Alchemy API URL not found.")
}

if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS == "") {
    console.log("🛑 Wallet Address not found.")
}

const sdk = new ThirdwebSDK(
    new ethers.Wallet(
        process.env.PRIVATE_KEY,
        ethers.getDefaultProvider(process.env.ALCHEMY_API_URL),
    ),
);

// console.log(process.env.ALCHEMY_API_URL);
// console.log(process.env.PRIVATE_KEY);
// console.log(process.env.WALLET_ADDRESS);

(async () => {
    try {
        const apps = await sdk.getApps();
        // console.log(apps);
        console.log("Your app address is:", apps[1].address);
    } catch(err) {
        console.error("Failed to get apps from the sdk", err);
        process.exit(1);
    }
})()


export default sdk;