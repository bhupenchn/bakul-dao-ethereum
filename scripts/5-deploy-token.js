import sdk from "./1-initialize-sdk.js";

const app = sdk.getAppModule("0x7F459558Bb2A3227EBB9035Ca94C52A0E85C0451");

(async() => {

    try {
        const tokenModule = await app.deployTokenModule({
            name: "Bakul Governance Token",
            symbol: "BAKUL",
        });
        console.log("✅ Successfully deployed token module:", tokenModule.address,);
    } catch(error) {
        console.error("failed to deploy token module", error);
    }

})();


// Your app address is: 0x7F459558Bb2A3227EBB9035Ca94C52A0E85C0451
// ✅ Successfully deployed token module: 0x42Ad364E62Ab4E264619C3d1974Dbc66716eeC2B