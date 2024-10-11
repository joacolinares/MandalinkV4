import { chain } from "@/chain";
import { client } from "@/client";
import { getContract } from "thirdweb";
import { mandaLinkAbi } from "./abis/mandaLinkAbi";
const USDTAddress = "0x31B4245d9f88DA6Fa01A14398adA46b177c7F2ba"
export const MandaLinkAddress = "0xA8aD8Cfda299e227f1B00629740350bec88bF465"
export const PaymentAddress = "0xA236D0b9fE04FAd23147194c4420F4dBaaD2C1D8"


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
