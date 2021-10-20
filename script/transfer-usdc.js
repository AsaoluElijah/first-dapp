async function transferUsdc() {
  let receiver = document.getElementById("receiver").value;
  let amount = document.getElementById("amount").value;
  let response;

  await provider.send("eth_requestAccounts", []);
  const signer = provider.getSigner();
  let userAddress = await signer.getAddress();

  const usdcContract = new ethers.Contract(usdc.address, usdc.abi, signer);

  try {
    receiver = ethers.utils.getAddress(receiver);
  } catch {
    response = `Invalid address: ${receiver}`;
    document.getElementById("transferResponse").innerText = response;
    document.getElementById("transferResponse").style.display = "block";
  }

  try {
    amount = ethers.utils.parseUnits(amount, 6);
    if (amount.isNegative()) {
      throw new Error();
    }
  } catch {
    console.error(`Invalid amount: ${amount}`);
    response = `Invalid amount: ${amount}`;
    document.getElementById("transferResponse").innerText = response;
    document.getElementById("transferResponse").style.display = "block";
  }

  const balance = await usdcContract.balanceOf(userAddress);

  if (balance.lt(amount)) {
    let amountFormatted = ethers.utils.formatUnits(amount, 6);
    let balanceFormatted = ethers.utils.formatUnits(balance, 6);
    console.error(
      `Insufficient balance receiver send ${amountFormatted} (You have ${balanceFormatted})`
    );

    response = `Insufficient balance receiver send ${amountFormatted} (You have ${balanceFormatted})`;
    document.getElementById("transferResponse").innerText = response;
    document.getElementById("transferResponse").style.display = "block";
  }
  let amountFormatted = ethers.utils.formatUnits(amount, 6);

  console.log(`Transferring ${amountFormatted} USDC receiver ${receiver}...`);

  response = `Transferring ${amountFormatted} USDC receiver ${receiver.slice(
    0,
    6
  )}...`;
  document.getElementById("transferResponse").innerText = response;
  document.getElementById("transferResponse").style.display = "block";

  const tx = await usdcContract.transfer(receiver, amount, { gasPrice: 20e9 });
  console.log(`Transaction hash: ${tx.hash}`);
  document.getElementById(
    "transferResponse"
  ).innerText += `Transaction hash: ${tx.hash}`;

  const receipt = await tx.wait();
  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
  document.getElementById(
    "transferResponse"
  ).innerText += `Transaction confirmed in block ${receipt.blockNumber}`;
}
