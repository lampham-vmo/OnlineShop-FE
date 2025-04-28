'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const FailedCheckout = () => {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const msg = searchParams.get('message');
    if (msg) {
      setMessage(msg);
    } else {
      setMessage('An unexpected error occurred.');
    }
  }, [searchParams]);

  if (!message) {
    return null;
  }

  return (
    <section className="overflow-hidden py-20 bg-gray-2">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="bg-white rounded-xl shadow-1 px-4 py-10 sm:py-15 lg:py-20 xl:py-25">
          <div className="text-center">
            <h2 className="font-bold text-red-500 text-4xl lg:text-[45px] lg:leading-[57px] mb-5">
              Payment Failed!
            </h2>
            <h3 className="font-medium text-dark text-xl sm:text-2xl mb-3">
              {message}
            </h3>
            <p className="max-w-[700px] w-full mx-auto mb-7.5">
              We apologize, but your payment was not successful. Please try
              again or contact our support team if you need assistance. Thank
              you for your understanding!
            </p>

            <Link
              className="inline-flex items-center gap-2 font-medium text-white bg-red-500 py-3 px-6 rounded-md ease-out duration-200 hover:bg-red-600"
              href="/product-list"
            >
              Continue Shopping
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="rotate-180"
              >
                <path
                  d="M16.6654 9.37502C17.0105 9.37502 17.2904 9.65484 17.2904 10C17.2904 10.3452 17.0105 10.625 16.6654 10.625H8.95703L8.95703 15C8.95703 15.2528 8.80476 15.4807 8.57121 15.5774C8.33766 15.6742 8.06884 15.6207 7.89009 15.442L2.89009 10.442C2.77288 10.3247 2.70703 10.1658 2.70703 10C2.70703 9.83426 2.77288 9.67529 2.89009 9.55808L7.89009 4.55808C8.06884 4.37933 8.33766 4.32586 8.57121 4.42259C8.80475 4.51933 8.95703 4.74723 8.95703 5.00002L8.95703 9.37502H16.6654Z"
                  fill=""
                ></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FailedCheckout;
