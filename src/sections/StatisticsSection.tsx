import { MandaLinkContract } from "@/utils/contracts";
import { t } from "i18next";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useActiveAccount, useReadContract } from "thirdweb/react";

interface UserStats {
  totalUsers: number;
  paid: number;
  colorIndicator: "green" | "yellow";
  positionOptions: string[];
}

interface StatisticsSectionProps {
  stats: UserStats[];
}

const Indicator: React.FC<{ amount: number, id: number }> = ({ amount, id }) => (
  <div
    className={`w-6 h-6 rounded-full mr-3 ${
      amount >= id ? "bg-green-500" : "bg-yellow-500"
    }`}
  />
);

const CustomSelect: React.FC<{ options: string[] }> = ({ options }) => {
  const { t } = useTranslation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleChange = (direction: "up" | "down") => {
    setSelectedIndex((prev) =>
      direction === "up"
        ? (prev - 1 + options.length) % options.length
        : (prev + 1) % options.length
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="mt-2 bg-[#632667] text-white text-base px-2 py-1 w-full rounded-md flex items-center justify-between hover:outline hover:outline-1 hover:outline-white">
        <div className="flex flex-col my-1">
          <button
            onClick={() => handleChange("up")}
            className="text-sm leading-none"
          >
            &#9650;
          </button>
          <button
            onClick={() => handleChange("down")}
            className="text-sm leading-none"
          >
            &#9660;
          </button>
        </div>
        <div
          className="flex-grow text-center cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          {options.length > 0 ? Number(options[selectedIndex]) + 1 : t("landing.noPositions")}
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black !text-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div
            ref={modalRef}
            className="bg-c-violet-2 text-white rounded-lg p-4 m-4 h-96 w-96"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">
                {t("landing.list")}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className=" hover:text-gray-300 text-lg font-bold text-white"
              >
                &#x2715;
              </button>
            </div>

            <div className="h-[90%]  overflow-y-auto">
              {options.length > 0 ? (
                options.map((option, index) => (
                  <div
                    key={index}
                    className="p-2 hover:bg-gray-100 hover:rounded-md hover:bg-opacity-10"
                    onClick={() => {
                      setSelectedIndex(index);
                      setIsOpen(false);
                    }}
                  >
                    {Number(option) + 1}
                  </div>
                ))
              ) : (
                <div className="text-center text-white">{t("landing.noPositions")}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const StatisticsCard: React.FC<{ stats: UserStats; index: number }> = ({
  stats,
  index,
}) => {
  const { t } = useTranslation();

  const address = useActiveAccount()

  const { data: poolData } = useReadContract({
    contract: MandaLinkContract,
    method: "function pools(uint256) view returns (uint256 price, uint256 numUsers)",
    params: [BigInt(index)]
  })

  const { data: userData } = useReadContract({
    contract: MandaLinkContract,
    method: "function users(address) view returns (address referrer, uint256 directReferrals, uint256 missedOpportunities, uint256 payedExtra, uint256 totalTree)",
    params: address ? [address.address] : ["0x0000000000000000000000000000000000000000"]
  })

  const { data: poolPositions } = useReadContract({
    contract: MandaLinkContract,
    method: "function getPurchases(address userAddress) view returns ((uint256 poolId, uint256 position, bool hasPassed, bool startedInThisPool, bool canContribute)[])",
    params: address ? [address.address] : ["0x0000000000000000000000000000000000000000"]
  })

  const filteredPositions = poolPositions
    ? poolPositions
        .filter((positionObj: any) => positionObj.poolId === BigInt(index))
        .map((positionObj: any) => positionObj.position)
    : [];

  return (
    <div className="w-[45%] lg:w-[20%] flex flex-col items-center justify-center rounded-lg m-2 overflow-visible">
      <div className="w-full h-44 text-2xl font-semibold text-center bg-[#632667] rounded-lg px-2 py-4 flex flex-col justify-between relative">
        <div className="absolute flex flex-row top-2 justify-between w-full">
          <div className="w-6 h-6 border border-white flex items-center justify-center text-sm font-semibold rounded-md">
            <p className="text-white">{index}</p>
          </div>
          <Indicator amount={userData ? Number(userData[1]) : 0} id={index - 1}/>
        </div>
        <div className="absolute inset-0 flex items-center justify-center"></div>
        <div className="mt-8 text-white">
          <div className="text-lg font-normal">{t("landing.totalUsers")}</div>
          <div className="text-3xl font-bold">{poolData ? poolData[1].toString() : "0"}</div>
        </div>
      </div>
      <CustomSelect options={filteredPositions} />
    </div>
  );
};

const StatisticsSection: React.FC<StatisticsSectionProps> = ({ stats }) => {
  const { t } = useTranslation();

  return (
    <div className="StatisticsSection mt-20 flex flex-col items-center">
      <h1 className="w-full text-2xl font-bold mb-4 flex flex-col items-start">
        <span>{t("landing.statistics")}</span>
      </h1>
      <div className="flex flex-wrap justify-center">
        {stats.map((stat, index) => (
          <StatisticsCard key={index} stats={stat} index={index + 1} />
        ))}
      </div>
    </div>
  );
};

export default StatisticsSection;
