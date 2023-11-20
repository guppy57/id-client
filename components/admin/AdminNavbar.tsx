import Link from "next/link";
import Image from "next/image";
import useLogout from "@/hooks/useLogout";

export default function AdminNavbarComponent() {
  const { performLogout } = useLogout();

  const handleLogout = (e: any) => {
    // prevents default button click behavior
    if (e) e.preventDefault();

    // closes the keychain using id-api
    performLogout();
  };

  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <Link href="/admin/apps">
            <Image
              className="h-8 w-auto sm:h-12"
              src="https://res.cloudinary.com/dlazo25rt/image/upload/v1700092604/kreative-id/kreative-id_zpbczr.png"
              alt={"Kreative ID Logo in Black and White"}
              width={300}
              height={100}
            />
          </Link>
        </div>
        <div className="mt-4 flex space-x-8 md:mt-0 md:ml-4">
          <Link
            className="inline-block py-2 text-base font-medium text-black"
            href="/admin/apps"
          >
            Apps
          </Link>
          <Link
            className="inline-block py-2 text-base font-medium text-black"
            href="/admin/accounts"
          >
            Accounts
          </Link>
          <a
            className="inline-block py-2 text-base font-medium text-black"
            href="https://support.kreativeusa.com/id"
            target={"_blank"}
            rel={"noreferrer"}
          >
            Get Support
          </a>
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={(e) => handleLogout(e)}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
