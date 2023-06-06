const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const ethers = require("ethers");
const FactoryABI = require("./abi/NFTFactory.json");

const FactoryContractAddress = "0xA5836644CFa9087cdc663C12EdFEc4DFE750fDc6";
const endpointURL = `https://goerli-rollup.arbitrum.io/rpc`;
dotenv.config();
let NFTCollections = [];
const app = express();
const eventListner = async () => {
  const provider = new ethers.JsonRpcProvider(endpointURL);
  const contract = new ethers.Contract(
    FactoryContractAddress,
    FactoryABI.abi,
    provider
  );
  contract.on("CollectionCreated", (addr, name, symbol) => {
    let filtered = NFTCollections.filter(
      (collection) => collection.addr === addr
    );
    if (filtered.length === 0) {
      NFTCollections.push({
        addr,
        name,
        symbol,
      });
      console.log("Created new Collection: address:", addr);
    }
  });
};
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/getCollections", (req, res) => {
  return res.json({ NFTCollections });
});

const port = process.env.PORT;
eventListner();
app.listen(port, () => {
  console.info(`server started on port ${port}`); // eslint-disable-line no-console
});
