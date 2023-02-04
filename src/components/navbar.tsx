import { CloudIcon, GaugeIcon, PeopleIcon } from "./icons";

export default function Navbar() {
  return (
    <>
      <div className="flex min-h-full w-[70px] flex-none flex-col bg-gray-100 py-4">
        <div className="flex flex-grow flex-col flex-wrap space-y-2">
          <div className="mx-auto grid h-[50px] w-[50px] place-content-center rounded-md border-2">
            <GaugeIcon />
          </div>
          <div className="mx-auto grid h-[50px] w-[50px] place-content-center rounded-md border-2">
            <CloudIcon />
          </div>
          <div className="mx-auto grid h-[50px] w-[50px] place-content-center rounded-md border-2 border-blue-300 bg-white">
            <PeopleIcon />
          </div>
        </div>
        <div>
          <div className="mx-auto grid h-[40px] w-[40px] place-content-center rounded-full bg-white">
            J
          </div>
        </div>
      </div>
    </>
  );
}
