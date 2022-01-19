import sdk from './1-initialize-sdk.js';
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
    "0x03267C15Dc3b5D5770650b22773FddbB81A39988"
);

(async () => {
    try {
        await bundleDrop.createBatch([
            {
                name: "Bakul Foundation Cohort",
                description: "This NFT will give you access to BakulDAO!",
                image: readFileSync("./scripts/assets/bakulDAO.png")
            },
        ]);
        console.log("Successfully created a new NFT!");
    } catch (error) {
        console.error("failed to create new NFT", error);
    }
}) ()