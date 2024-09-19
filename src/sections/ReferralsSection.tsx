import { showSuccessAlert } from "@/utils/notifications";
import React from "react";
import { useTranslation } from "react-i18next";

interface Referral {
  level: number;
  percentage: string;
  value: number;
  downloadLink: string;
}

interface ReferralData {
  totalReferrals: number;
  investmentLink: string;
  referrals: Referral[];
}

interface ReferralsProps {
  data: ReferralData;
}

const Referrals: React.FC<ReferralsProps> = ({ data }) => {
  const { t } = useTranslation();
  const { totalReferrals, investmentLink, referrals } = data;

  // Calculate total referral investment
  const totalReferralInvestment = referrals.reduce(
    (total, referral) => total + referral.value,
    0
  );

  const handleCopy = () => {
    navigator.clipboard
      .writeText(investmentLink)
      .then(() => {
        showSuccessAlert("¡Link copiado!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="Referrals mt-20 flex flex-col items-center ">
      <h1 className="w-full text-2xl font-bold mb-4 flex flex-col items-start">
        <span>{t("landing.referred")}</span>
      </h1>
      <div className="text-xl  flex flex-col items-center gap-2 mb-2">
        <span>{t("landing.totalReferred")}</span>
        <span className="text-2xl font-bold">{totalReferrals}</span>
      </div>
      <div className="flex flex-col w-full ">
        {referrals.map((referral) => (
          <div
            key={referral.level}
            className="flex justify-between items-center py-2"
          >
            <div>{`${t("landing.level")} ${referral.level}: ${
              referral.percentage
            }`}</div>
            <div className="flex items-center">
              <span className="mr-3 font-bold">{referral.value}</span>

              <div className="flex items-center">
                <a
                  href={referral.downloadLink}
                  className="text-white font-light text-xs grey-purple-color rounded px-2 py-1 flex items-center hover:outline outline-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("landing.download")}
                  <svg
                    className="w-4 h-4 ml-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 10L12 15L17 10"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 15V3"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 16V21H3V16"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 w-full">
        <div className="flex justify-between my-4">
          <span className="font-bold">
            {t("landing.totalReferralInvestment")}
          </span>
          <span className="font-bold">{totalReferralInvestment}</span>
        </div>

        <div className=" grey-purple-color rounded px-2 py-1 w-full mt-2 max-h-20 overflow-y-auto break-words">
          {investmentLink}
        </div>

        <div className="flex justify-center mt-4">
          <button
            className="text-center grey-purple-color text-white rounded px-4 py-2 hover:outline outline-1"
            onClick={handleCopy}
          >
            {t("landing.copy")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Referrals;
