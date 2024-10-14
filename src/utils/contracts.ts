import { chain } from "@/chain";
import { client } from "@/client";
import { getContract } from "thirdweb";
import { mandaLinkAbi } from "./abis/mandaLinkAbi";
const USDTAddress = "0x31B4245d9f88DA6Fa01A14398adA46b177c7F2ba"
export const MandaLinkAddress = "0x6831B3Be0f535faCB4cffE4A3b1b669539C97246"
export const PaymentAddress = "0xC746caacB60cA0043994e64cDDE57f318765a9Eb"


export const USDTContract = getContract({
    client: client,
    address: USDTAddress,
    chain: chain
})
export const MandaLinkContract = getContract({
    client: client,
    address: MandaLinkAddress,
    chain: chain,
  //  abi: mandaLinkAbi
})
export const MandaLinkContract2 = getContract({
    client: client,
    address: MandaLinkAddress,
    chain: chain,
    abi: mandaLinkAbi
})
export const PaymentContract = getContract({
    client: client,
    address: PaymentAddress,
    chain: chain
})
