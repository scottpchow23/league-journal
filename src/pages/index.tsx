import { type NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
        League <span className="text-blue-300">Journal</span>
      </h1>
      <p className="text-2xl text-gray-700">
        League Journal is a tool for keeping track of your League of Legends
        progress by recording journals for every game you play.
      </p>
    </>
  );
};

export default Home;
