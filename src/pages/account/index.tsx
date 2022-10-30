import { type NextPage } from "next";
import dynamic from "next/dynamic";
import { useForm } from "react-hook-form";
const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });

import { trpc } from "../../utils/trpc";

interface FormValues {
  name: string;
}

const Page: NextPage = () => {
  const getAccount = trpc.getAccount.getAccount.useQuery();
  const { register, handleSubmit } = useForm<FormValues>();
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("name")}
          className="focus:shadow-outline w-full appearance-none rounded border py-2 px-3 leading-tight text-gray-700 shadow focus:outline-none"
          required
          type="text"
          placeholder="Summoner Name"
          autoComplete="off"
        />
        <button>Save</button>
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
