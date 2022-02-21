Moralis.initialize("cbk0tJttDwxzKobjzGZK9uVPiV6r0U179lah5jNy"); // Application id from moralis.io
Moralis.serverURL = "https://nu5ec99mmwp6.usemoralis.com:2053/server"; //Server url from moralis.io

const nft_contract_address = "0x0Fb6EF3505b9c52Ed39595433a21aF9B5FCc4431" //NFT Minting Contract Use This One "Batteries Included", code of this contract is in the github repository under contract_base for your reference.
/*
Available deployed contracts
Ethereum Rinkeby 0x0Fb6EF3505b9c52Ed39595433a21aF9B5FCc4431
Polygon Mumbai 0x351bbee7C6E9268A1BF741B098448477E08A0a53
BSC Testnet 0x88624DD1c725C6A95E223170fa99ddB22E1C6DDD
*/

const web3 = new Web3(window.ethereum);

//frontend logic

async function login(){
  document.getElementById('submit').setAttribute("disabled", null);
  document.getElementById('username').setAttribute("disabled", null);
  document.getElementById('useremail').setAttribute("disabled", null);
  Moralis.Web3.authenticate().then(function (user) {
      user.set("name",document.getElementById('username').value);
      user.set("email",document.getElementById('useremail').value);
      user.save();
      document.getElementById("upload").removeAttribute("disabled");
      document.getElementById("file").removeAttribute("disabled");
      document.getElementById("name").removeAttribute("disabled");
      document.getElementById("description").removeAttribute("disabled");
  })
}

async function upload(){
  const fileInput = document.getElementById("file");
  const data = fileInput.files[0];
  const imageFile = new Moralis.File(data.name, data);
  document.getElementById('upload').setAttribute("disabled", null);
  document.getElementById('file').setAttribute("disabled", null);
  document.getElementById('name').setAttribute("disabled", null);
  document.getElementById('description').setAttribute("disabled", null);
  await imageFile.saveIPFS();
  const imageURI = imageFile.ipfs();
  const metadata = {
    "name":document.getElementById("name").value,
    "description":document.getElementById("description").value,
    "attributes": [
      {
      "trait_type": "Level",
      "value": Math.floor(Math.random() * (100 - 65)) + 65,
      "max_value": 100},
      {"trait_type": "Age",
      "value": Math.floor(Math.random() * (2000 - 20)) + 20},
      {"trait_type": "Health (HP)",
      "value": Math.floor(Math.random() * (500 - 100)) + 100,
      "max_value": 500},
      {"trait_type": "Speed",
      "value": Math.floor(Math.random() * (100 - 55)) + 55,
      "max_value": 100},
      {"trait_type": "Agility",
      "value": Math.floor(Math.random() * (100 - 55)) + 55,
      "max_value": 100},
      {"trait_type": "Luck",
      "value": Math.floor(Math.random() * (100 - 55)) + 55,
      "max_value": 100},      
      {"trait_type": "Attack",
      "value": Math.floor(Math.random() * (100 - 55)) + 55,
      "max_value": 100},
      {"trait_type": "Defense",
      "value": Math.floor(Math.random() * (100 - 55)) + 55,
      "max_value": 100},
      {"trait_type": "Magic (MP)",
      "value": Math.floor(Math.random() * (100 - 55)) + 55,
      "max_value": 100},
      {"trait_type": "Intellect",
      "value": Math.floor(Math.random() * (100 - 55)) + 55,
      "max_value": 100},
      {"display_type": "boost_number", 
      "trait_type": "HP", 
      "value": Math.floor(Math.random() * 100)},
      {"display_type": "boost_number", 
      "trait_type": "MP", 
      "value": Math.floor(Math.random() * 100)}, 
      {"display_type": "boost_number", 
      "trait_type": "ATK", 
      "value": Math.floor(Math.random() * 100)}, 
      {"display_type": "boost_number", 
      "trait_type": "DEF", 
      "value": Math.floor(Math.random() * 100)},
      {"display_type": "boost_number", 
      "trait_type": "LUCK", 
      "value": Math.floor(Math.random() * 100)},
  ],
    "image":imageURI
  }
  const metadataFile = new Moralis.File("metadata.json", {base64 : btoa(JSON.stringify(metadata))});
  await metadataFile.saveIPFS();
  const metadataURI = metadataFile.ipfs();
  const txt = await mintToken(metadataURI).then(notify)
}

async function mintToken(_uri){
  const encodedFunction = web3.eth.abi.encodeFunctionCall({
    name: "mintToken",
    type: "function",
    inputs: [{
      type: 'string',
      name: 'tokenURI'
      }]
  }, [_uri]);

  const transactionParameters = {
    to: nft_contract_address,
    from: ethereum.selectedAddress,
    data: encodedFunction
  };
  const txt = await ethereum.request({
    method: 'eth_sendTransaction',
    params: [transactionParameters]
  });
  return txt
}

async function notify(_txt){
  document.getElementById("resultSpace").innerHTML =  
  `<input disabled = "true" id="result" type="text" class="form-control" placeholder="Description" aria-label="URL" aria-describedby="basic-addon1" value="Your NFT was minted in transaction ${_txt}">`;
} 

