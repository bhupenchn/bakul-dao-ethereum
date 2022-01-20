import { useEffect, useMemo, useState } from "react";
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { ethers } from "ethers";

// instantiate sdk on rinkeby
const sdk = new ThirdwebSDK("rinkeby");

// grab reference of our ERC-1155 contract
const bundleDropModule = sdk.getBundleDropModule(
  "0x03267C15Dc3b5D5770650b22773FddbB81A39988",
)

const tokenModule = sdk.getTokenModule(
  "0x42Ad364E62Ab4E264619C3d1974Dbc66716eeC2B",
)

const App = () => {
  // these are hooks provided by 3rdweb 
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address: ", address)

  // The signer is required to sign transactions on the blockchain
  // without it we can only read data, not write.
  const signer = provider ? provider.getSigner() : undefined;

  // state variable for us to know if one has claimed an NFT
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  // isClaiming lets us set a loading state when NFT is loading
  const [isClaiming, setIsClaiming] = useState(false);

  // Holds the amount of token each member has in state.
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
  // The array holding all of our members addresses.
  const [memberAddresses, setMemberAddresses] = useState([]);

  // A fancy function to shorten someones wallet address, no need to show the whole thing. 
  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  // This useEffect grabs all the addresses of our members holding our NFT.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Just like we did in the 7-airdrop-token.js file! Grab the users who hold our NFT
    // with tokenId 0.
    bundleDropModule
      .getAllClaimerAddresses("0")
      .then((addresses) => {
        console.log("🚀 Members addresses", addresses)
        setMemberAddresses(addresses);
      })
      .catch((err) => {
        console.error("failed to get member list", err);
      });
  }, [hasClaimedNFT]);

  // This useEffect grabs the # of token each member holds.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Grab all the balances.
    tokenModule
      .getAllHolderBalances()
      .then((amounts) => {
        console.log("👜 Amounts", amounts)
        setMemberTokenAmounts(amounts);
      })
      .catch((err) => {
        console.error("failed to get token amounts", err);
      });
  }, [hasClaimedNFT]);

  // Now, we combine the memberAddresses and memberTokenAmounts into a single array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          // If the address isn't in memberTokenAmounts, it means they don't
          // hold any of our token.
          memberTokenAmounts[address] || 0,
          18,
        ),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

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
  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1>BakulDAO Member Page</h1>
        <p>Congratulations on being a member</p>
        <div>
          <div>
            <h2>Member List</h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
              <tbody>
                {memberList.map((member) => {
                  return (
                    <tr key={member.address}>
                      <td>{shortenAddress(member.address)}</td>
                      <td>{member.tokenAmount}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
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
