import { MerkleTree } from 'merkletreejs';
import keccak256 from 'keccak256';

const defaultWallets = [
  "0xfED930B2DBbc52996b2E107F1396d82256F41c41",
  "0xcEAa254a4df4f2eB888a09E498b55b618893B0A8"
]
export const getMerkleProof = async (account, walletListURI) => {
  console.log(walletListURI)
    if (walletListURI) {
      let whitelisted = defaultWallets
      // if (walletListURI.contains('.json')) {
      //   const walletResponse = await fetch(walletListURI);
      //   whitelisted = await walletResponse.text();
      // }

      console.log(whitelisted)

      const leaves = whitelisted.map(x => keccak256(x))
      const tree = new MerkleTree(leaves, keccak256, { sort: true })
      console.log(account)
      const leaf = keccak256(account)
      const proof = tree.getHexProof(leaf)
      console.log(proof)

      return proof
    }

  return null
}