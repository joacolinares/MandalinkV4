import { chain } from "@/chain";
import { client } from "@/client";
import { getContract } from "thirdweb";
import { mandaLinkAbi } from "./abis/mandaLinkAbi";
const USDTAddress = "0x31B4245d9f88DA6Fa01A14398adA46b177c7F2ba"
export const MandaLinkAddress = "0x57297F2954BE6e8D1F29AbBd37a4Cf9B1773cffC"
export const PaymentAddress = "0xFfbb8980F477BB95eBFB640c2501620abB954296"


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
