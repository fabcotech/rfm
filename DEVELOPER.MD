Here's what must go on:

Issuer is doctor/hospital/driving license authority
Alice is the user that needs documents

**Prequisites:**
Alice knows doctor's public key
Issuer knows Alice's public key
Issuer knows Alice's contract address

**Operations:**
(1) Issuer (encrypt with Alice's public key) [RChain] -> Alice 
(2) Alice  (encrypt with Issuer's public key) [RChain] -> Issuer
(3) Issuer (encrypt with Alice's public key) [RChain] -> Alice
(4) Alice  (encrypt with SECRET) [RChain] -> Final file


##### RChain

**Prequisites:**
Alice deploys a rchain-token contract with Infinity of tokens in bag "0", those tokens are purchasable by anyone.

**Operations:**
(1) Issuer generates a document/file,
- signs it
- encrypts it with Alice's public key so she can decrypt
- purchase one token from bag 0, and attach the file to it. There is a new bag `"1": {...}` with file attached to it

(2) Alice sees the file appearing in her contract
- decrypts it, see it, signs it, encrypts with Issuer's public key
- sends back the file by purchasing a new bag `"2": {...}` for example

(3) Doctor sees the new bag
- decrypts it, sees it, signs it, encrypts with Issuer's public key
- sends back the file by purchasing a new bag `"3": {...}` for example

(4) Alice sees the new bag
- check it, verifies signatures
- encrypts it with a SECRET she only knows
- adds a new bag to the contract, with this file attached