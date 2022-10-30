import { type NextPage } from "next";
import { trpc } from "../../utils/trpc";
import dynamic from "next/dynamic";
const DynamicReactJson = dynamic(import("react-json-view"), { ssr: false });

const Page: NextPage = () => {
  const games = trpc.games.loadGames.useQuery();
  return (
    <>
      <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
        Games
      </h1>
      {games.data ? (
        <DynamicReactJson src={games.data} />
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default Page;
