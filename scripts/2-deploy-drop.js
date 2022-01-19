import { ethers } from "ethers";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const app = sdk.getAppModule("0x7F459558Bb2A3227EBB9035Ca94C52A0E85C0451");

(async () => {
    try {
        const bundleDropModule = await app.deployBundleDropModule({
            // Collection Name
            name: "BakulDAO Membership",
            // Description
            description: "If not now when? If not us who?",
            // Image for the collection
            image: readFileSync("scripts/assets/BakulTreeLogo.png"),
            primarySaleRecipientAddress: ethers.constants.AddressZero,
        });

        console.log(
            "✅ Successfully deployed bundleDrop module, address:",
            bundleDropModule.address,
        );
        console.log(
            "✅ bundleDrop metadata:",
            await bundleDropModule.getMetadata(),
        );
    } catch (error) {
        console.log("failed to deploy bundleDrop", error);
    }
})()



// Your app address is: 0x7F459558Bb2A3227EBB9035Ca94C52A0E85C0451
// ✅ Successfully deployed bundleDrop module, address: 0x03267C15Dc3b5D5770650b22773FddbB81A39988
// ✅ bundleDrop metadata: {
//   metadata: {
//     name: 'BakulDAO Membership',
//     description: 'If not now when? If not us who?',
//     image: 'https://cloudflare-ipfs.com/ipfs/bafkreiep64h7phc77lfcis5y7dqfwrycntyct6xziwe2hq7dptpcy23vuu',
//     primary_sale_recipient_address: '0x0000000000000000000000000000000000000000',
//     uri: 'ipfs://bafkreibimghmhgwh7z7jkj5xv6om5oog3lmc3hmxv3pvq5fed7uvla3v54'
//   },
//   address: '0x03267C15Dc3b5D5770650b22773FddbB81A39988',
//   type: 11
// }
