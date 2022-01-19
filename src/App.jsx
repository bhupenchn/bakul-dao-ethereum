import { useEffect, useMemo, useState } from "react";
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";

// instantiate sdk on rinkeby
const sdk = new ThirdwebSDK("rinkeby");

// grab reference of our ERC-1155 contract
const bundleDropModule = sdk.getBundleDropModule(
  "0x03267C15Dc3b5D5770650b22773FddbB81A39988",
)

const App = () => {
  // these are hooks provided by 3rdweb 
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address: ", address)

  // The signer is required to sign transactions on the blockchain
  // without it we can only read data, not write.
  const signer = provider ? provider.getSigner() : undefined;

  // state variable for us to know if one has claimed an NFT
  const [hasClaimedNFt, setHasClaimedNFT] = useState(false);
  // isClaiming lets us set a loading state when NFT is loading
  const [isClaiming, setIsClaiming] = useState(false);

  // another useEffect
  useEffect(() => {
    // we pass the signer to the sdk which allows us to talk with our deployed contract
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  // useEffect to check if the user is a DAO member
  useEffect(() => {
    if (!address) {
      return;
    }

    // check if the user has the NFT by using bundleDropModule.balanceof
    return bundleDropModule.balanceOf(address, "0").then((balance) => {
      // if balance greater than 0
      if (balance.gt(0)) {
        setHasClaimedNFT(true);
        console.log("STAR STAR this user has NFT");
      } else {
        setHasClaimedNFT(false);
        console.log("DARK DARK this user does not have NFT");
      }
    })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.error("failed to nft balance", error);
      });
  }, [address]);

  // if wallet not connected
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to BakulDAO</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect your Wallet
        </button>
      </div>
    );
  }

  // If user has NFT show that he/she is a member
  if (hasClaimedNFt) {
    return (
      <div className="member-page">
        <h1>BakulDAO Member Page</h1>
        <p>Congratulations on being a member</p>
      </div>
    );
  };

  // if wallet connected show NFT details
  const mintNft = () => {
    setIsClaiming(true);
    // Call bundleDropModule.claim("0", 1) to mint nft to user's wallet.
    bundleDropModule
      .claim("0", 1) //token id of our membership is 0 - what does this mean?
      .then(() => {
        // Set claim state.
        setHasClaimedNFT(true);
        // Show user their fancy new NFT!
        console.log(
          `🌊 Successfully Minted! Check it our on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
        );
      })
      .catch((err) => {
        console.error("failed to claim", err);
      })
      .finally(() => {
        // Stop loading state.
        setIsClaiming(false);
      });
  }

  // Render mint nft screen.
  return (
    <div className="mint-nft">
      <h1>Mint your free BakulDAO Membership NFT</h1>
      <button
        disabled={isClaiming}
        onClick={() => mintNft()}
      >
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>
  );
};


export default App;
