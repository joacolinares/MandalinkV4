import { MandaLinkAddress, MandaLinkContract, USDTContract } from "@/utils/contracts";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { prepareContractCall, sendTransaction, waitForReceipt } from "thirdweb";
import { useActiveAccount, useReadContract, useSendTransaction, useWaitForReceipt } from "thirdweb/react";
import { approve } from "thirdweb/extensions/erc20";
import { client } from "@/client";
import { chain } from "@/chain";

//Recibe valor y moneda en este formato "50 USDT", separa eso en partes y las muestra
const Card: React.FC<{ id: number, amount: string }> = ({ id, amount }) => {
  const { t } = useTranslation();

  const address = useActiveAccount()

  const [ referral, setReferral ] = useState<string | null>("")

  const { data: user } = useReadContract({
    contract: MandaLinkContract,
    method: "function users(address) view returns (address referrer, uint256 directReferrals, uint256 missedOpportunities, uint256 payedExtra, uint256 totalTree)",
    params: address ? [address.address] : ["0x0000000000000000000000000000000000000000"]
  })

  const handleTransaction = async (ref: string) => {
    if (address) {
      try {
        const app = await approve({
          contract: USDTContract,
          spender: MandaLinkAddress,
          amount: Number(value)
        })

        const { transactionHash: approveHash } = await sendTransaction({
          transaction: app,
          account: address
        });

        const approveReceipt = await waitForReceipt({
          client: client,
          chain: chain,
          transactionHash: approveHash
        })

        console.log(approveReceipt)

        const transaction = prepareContractCall({
          contract: MandaLinkContract,
          method: "function joinPool(uint256 poolId, address referrer, address wallet)",
          params: [BigInt(id + 1), ref, address.address]
        })

        const { transactionHash: joinPoolHash } = await sendTransaction({
          transaction,
          account: address
        })

        const joinPoolReceipt = await waitForReceipt({
          client: client,
          chain: chain,
          transactionHash: joinPoolHash
        })

        console.log(joinPoolReceipt)

        window.location.reload();

      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleJoinPool = async (id: number) => {
    if (user && user[0]) {
      handleTransaction("0x0000000000000000000000000000000000000000")
    } else {
      if (referral) {
        handleTransaction(referral)
      } else {
        alert("Por favor ingrese con un link de referido")
      }
    }
  }

  const [value, currency] = amount.split(" ");

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setReferral(searchParams.get("REF"))
    console.log(referral)
  })

  return (
    <div className="w-[45%] lg:w-[20%] flex flex-col items-center justify-center rounded-lg m-2 overflow-visible">
      <div className="w-full h-44 text-2xl font-semibold text-center grey-purple-color rounded-lg px-2 py-4 flex flex-col justify-between relative">
        <div className="absolute flex flex-row top-2 justify-between w-full">
          <div className="w-6 h-6 border border-white flex items-center justify-center text-sm font-semibold rounded-md">
            <p className="text-white">{id + 1}</p>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center"></div>
        <div className="mt-8 text-white">
          <div className="text-3xl font-bold">{value}</div>
          <div className="text-3xl font-bold">{currency}</div>
        </div>
      </div>
      {address && (
        <button
          className="mt-2 grey-purple-color text-white text-base rounded-md px-2 py-1 w-full min-h-10 shadow-md hover:!bg-opacity-80 hover:outline outline-1"
          onClick={() => handleJoinPool(id)}
        >
          {t("landing.buyPosition")}
        </button>
      )}
    </div>
  );
};

const SelectPoolSection: React.FC = () => {
  const { t } = useTranslation();

  const amounts: string[] = [
    "50 USDT",
    "100 USDT",
    "200 USDT",
    "300 USDT",
    "400 USDT",
    "500 USDT",
    "1000 USDT",
  ];

  return (
    <div className="SelectPoolSection w-full mt-20 flex flex-col items-center">
      <h1 className="w-full text-2xl font-bold mb-4 flex flex-col items-start">
        <span className="text-left">{t("landing.selectPool")}</span>
      </h1>
      <div className="flex flex-wrap justify-center">
        {amounts?.map((amount, index) => (
          <Card key={index} id={index} amount={amount} />
        ))}
      </div>
    </div>
  );
};

export default SelectPoolSection;
