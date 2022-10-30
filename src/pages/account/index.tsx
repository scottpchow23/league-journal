import { type NextPage } from "next";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });

import { trpc } from "../../utils/trpc";

interface FormValues {
  name: string;
}

const Page: NextPage = () => {
  const getAccount = trpc.getAccount.getAccount.useQuery();
  const { register, reset, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      name: getAccount.data?.name || "",
    },
  });
  useEffect(() => {
    reset({
      name: getAccount.data?.name || "",
    });
  }, [getAccount.data, reset]);
  console.dir(getAccount.data?.name);
  const saveSummoner = trpc.getAccount.upsertSummonerByName.useMutation();
  const onSubmit = async (data: FormValues) => {
    await saveSummoner.mutateAsync(data);
    getAccount.refetch();
  };
  return (
    <>
      <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
        Account
      </h1>
      <p className="text-center text-2xl text-gray-700">
        This is where you configure the account that you&apos;ll be journaling
        matches for.
        <br /> Keep in mind that changing accounts means you&apos;ll lose{" "}
        <strong>all</strong> games and journals associated with the previous
        account.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
        <div className="flex flex-row">
          <input
            {...register("name")}
            className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
            required
            type="text"
            placeholder="Summoner Name"
            autoComplete="off"
          />
          <button
            type="submit"
            className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </form>
      <div className="flex w-full items-center justify-center pt-6 text-2xl text-blue-500">
        {getAccount.data && window && (
          <DynamicReactJson src={getAccount.data || {}} />
        )}
      </div>
    </>
  );
};

export default Page;
