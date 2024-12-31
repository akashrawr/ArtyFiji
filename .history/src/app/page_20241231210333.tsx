'use client'; // This is a client component

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import cn from 'classnames';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Head from 'next/head';

// Define your Image type
type Image = {
  id: number;
  href: string;
  imageSrc: string;
  title: string; //name
  description: string; // username
};

// Fetch the data directly in the component (from Supabase)
export default function Gallery() {
  const [isOpen, setIsOpen] = useState(false);
  const [copy, setCopy] = useState('Copy');
  const [images, setImages] = useState<Image[]>([]);

  // Supabase URL and Key from environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase URL and Key must be set in your environment variables.');
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // Fetch the images data from Supabase
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('images') // Assuming 'images' is the table name
      .select('*')
      .order('id');

    if (error) {
      console.error(error);
    } else {
      setImages(data || []);
    }
  };

  // Fetch data when the component mounts
  React.useEffect(() => {
    fetchData();
  }, []);

  function closeModal() {
    setIsOpen(false);
    setCopy('Copy');
  }

  function openModal() {
    if (navigator.share) {
      navigator
        .share({
          title: 'ArtyFiji',
          text: 'rawr',
          url: 'https://artyfiji.vercel.app/',
        })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }
    setIsOpen(true);
    navigator.clipboard.writeText('https://artyfiji.vercel.app/');
  }

  return (
    <>
      <Head>
        <title>ArtyFiji</title>
        <meta name="description" content="Discover beautiful artwork and creative expressions on ArtyFiji." />
      </Head>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="mb-6 pl-2 border-b-8 border-blue-800 flex items-center lg:items-stretch flex-row">
          <h1 className="select-none transition transform origin-left -skew-x-6 inline-block p-2 text-5xl bg-gradient-to-tr from-blue-800 to-blue-500 text-transparent bg-clip-text font-extrabold">
            ArtyFiji
          </h1>
          <div className="justify-end flex flex-1 pt-4 pr-8 pb-4">
            <button
              onClick={openModal}
              className="text-base hover:scale-110 focus:outline-none flex justify-center px-4 py-2 rounded font-bold cursor-pointer hover:bg-blue-700 hover:text-blue-100 bg-blue-50 text-blue-700 border duration-200 ease-in-out border-blue-600 transition"
            >
              <div className="flex leading-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 mr-3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
                  />
                </svg>
                Share
              </div>
            </button>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {images.map((image) => (
            <BlurImage key={image.id} image={image} />
          ))}
        </div>
      </div>

      {/* Modal for sharing */}
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-bold leading-6 text-gray-900 mb-2"
                  >
                    Share this link
                  </Dialog.Title>
                  <div className="mt-2">
                    <div className="border-2 border-gray-200 flex justify-between items-center mt-4 py-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        className="fill-gray-500 ml-2"
                      >
                        <path d="M8.465 11.293c1.133-1.133 3.109-1.133 4.242 0l.707.707 1.414-1.414-.707-.707c-.943-.944-2.199-1.465-3.535-1.465s-2.592.521-3.535 1.465L4.929 12a5.008 5.008 0 0 0 0 7.071 4.983 4.983 0 0 0 3.535 1.462A4.982 4.982 0 0 0 12 19.071l.707-.707-1.414-1.414-.707.707a3.007 3.007 0 0 1-4.243 0 3.005 3.005 0 0 1 0-4.243l2.122-2.121z"></path>
                        <path d="m12 4.929-.707.707 1.414 1.414.707-.707a3.007 3.007 0 0 1 4.243 0 3.005 3.005 0 0 1 0 4.243l-2.122 2.121c-1.133 1.133-3.109 1.133-4.242 0L10.586 12l-1.414 1.414.707.707c.943.944 2.199 1.465 3.535 1.465s2.592-.521 3.535-1.465L19.071 12a5.008 5.008 0 0 0 0-7.071 5.006 5.006 0 0 0-7.071 0z"></path>
                      </svg>

                      <input
                        className="w-full outline-none bg-transparent"
                        type="text"
                        placeholder="link"
                        value="https://artyfiji.vercel.app/"
                      />

                      <button
                        onClick={() => setCopy('Copied!')}
                        className="bg-blue-500 text-white rounded-md text-sm py-2 px-5 mr-2 hover:bg-blue-600"
                      >
                        {copy}
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

// Image component for each image
function BlurImage({ image }: { image: Image }) {
  const [isLoading, setLoading] = useState(true);

  return (
    <a href={image.href} className="group">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
        <Image
          alt={image.description}
          src={image.imageSrc}
          layout="fill"
          objectFit="cover"
          className={cn(
            'duration-700 ease-in-out group-hover:opacity-75',
            isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'
          )}
          onLoadingComplete={() => setLoading(false)}
        />
      </div>
      <h3 className="mt-4 text-sm text-gray-700">{image.description}</h3>
      <p className="mt-1 text-lg font-medium text-gray-900">{image.title}</p>
    </a>
  );
}