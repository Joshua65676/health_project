import React from "react";
import NavBar from "../NavBar";
import { HeartIcon, Icon, Sparkle } from "../../assets";
import SignUpForm from "../SignUpForm";

const SignUp: React.FC = () => {
  return (
    <section className="flex flex-col gap-8 bg-linear-to-b from-[#cfdee3] to-[#fafafa]">
      <NavBar />
      <section className="flex items-center justify-center lg:justify-between flex-row max-h-screen container max-w-7xl mx-auto w-full">
        <main className="md:flex flex-col items-start gap-8 -mt-20 hidden">
          <div className="flex flex-col items-start gap-3.5">
            <div className="w-59 h-8.5 rounded-[10px] bg-LightGreen py-1 px-2.5 space-x-1.5 text-center">
              <img src={Sparkle} alt="" className="inline-block" />
              <span className="font-Inter font-semibold text-[15px] leading-6 tracking-normal text-center text-TextColor">
                Your AI Health Assistance
              </span>
            </div>
            <h2 className="font-semibold text-[40px] leading-10 tracking-[-0.32px] text-TextColor">
              Personalized care
            </h2>
            <p className="font-Inter font-[400px] w-87.5 text-[16px] leading-7 text-Grey">
              Join MediAI to unlock precision health insights, empathetic
              support, and 24/7 medical guidance tailored just for you.
            </p>

            <div className="absolute left-68 top-10 hidden md:flex">
              <img src={HeartIcon} alt="" />
            </div>
          </div>

          <div className="flex flex-col items-start gap-5">
            <div className="w-140.5 h-25 rounded-[10px] bg-white py-5 px-8">
              <div className="flex flex-row items-center gap-6">
                <div className="w-7.75 h-7.75 rounded-lg bg-BoxBg shadow-hard p-1.5">
                  <img src={Icon} alt="" />
                </div>
                <div>
                  <h2 className="font-Inter font-medium text-[14px] leading-6 text-TextBlack">
                    Evidence-Based
                  </h2>
                  <p className="font-Inter font-[400px] text-[14px] leading-5 tracking-[0.14px] w-108 text-black">
                    Our AI is trained on peer-reviewed medical literature and
                    clinical data.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-140.5 h-25 rounded-[10px] bg-white py-5 px-8">
              <div className="flex flex-row items-center gap-6">
                <div className="w-7.75 h-7.75 rounded-lg bg-BoxBg shadow-hard p-1.5">
                  <img src={Icon} alt="" />
                </div>
                <div>
                  <h2 className="font-Inter font-medium text-[14px] leading-6 text-TextBlack">
                    HIPAA Complaint
                  </h2>
                  <p className="font-Inter font-[400px] text-[14px] leading-5 tracking-[0.14px] w-108 text-black">
                    your data is encrypted with enterprise-grade security
                    protocols.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <>
          <SignUpForm />
        </>
      </section>
    </section>
  );
};

export default SignUp;
