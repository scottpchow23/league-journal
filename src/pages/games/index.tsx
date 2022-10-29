import { type NextPage } from "next";

import { trpc } from "../../utils/trpc";

const Home: NextPage = () => {
  const getAccount = trpc.getAccount.getAccount.useQuery();
  return (
    <>
      <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
        Games
      </h1>
      <div className="flex w-full items-center justify-center pt-6 text-2xl text-blue-500">
        {getAccount.data ? <p>{getAccount.data}</p> : <p>Loading..</p>}
      </div>
    </>
  );
};

export default Home;
