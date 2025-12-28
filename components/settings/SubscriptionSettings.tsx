import Link from 'next/link'
import { PORTAL_LINK } from "@/util/helpers";

export default function SubscriptionSettings(){
    const email = sessionStorage.getItem('email');

    return(
        <div className="h-full min-h-[300px] flex items-center justify-center">
          <div className="flex flex-col items-center text-center gap-3">
            <h3 className="text-black font-semibold">
              The subscription plan is in another castle
            </h3>
            <Link 
                href={PORTAL_LINK+'?prefilled_email='+email}
                target="_blank"
                rel="noopener noreferrer"
                className={"rounded-md px-20 py-2 font-semibold transition bg-[#42B6B1] text-white hover:bg-teal-600 cursor-pointer"}
            >
                <button
                  className="rounded-md px-20 py-2 font-semibold transition bg-[#42B6B1] 
                  text-white hover:bg-teal-600 cursor-pointer">
                  Manage Subscription
                </button>
            </Link>
          </div>
        </div>
)
}