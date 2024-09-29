import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Search, Menu, X, Share2, Mail, Twitter, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { signOut, useSession } from 'next-auth/react';

const DashboardNavbar = () => {
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserLogin, setIsUserLogin] = useState(false);
  const shareMessage = 'Hey! Join me to rate your nearby streets and stay ahead of congestion. Visit ratemystreet.onlydev.in/dashboard to add your review 🎉';

  const { data: session } = useSession();

  // Handle share actions based on platform
  const handleShare = (platform: string) => {
    let url;
    switch (platform) {
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;
        break;
      case 'email':
        url = `mailto:?subject=Join me on RateMyStreet&body=${encodeURIComponent(shareMessage)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`;
        break;
      case 'sms':
        url = `sms:?&body=${encodeURIComponent(shareMessage)}`;
        break;
      default:
        return;
    }
    window.open(url, '_blank');
  };

  const toggleSearch = () => {
    setSearchVisible(!isSearchVisible);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  useEffect(() => {
    if(session?.user){
      setIsUserLogin(true);
    }else if(session === null){
      setIsUserLogin(false);
    }
  }, [session])

  return (
    <div className='w-full fixed top-0 z-999 h-10vh flex justify-between items-center bg-gray-50 px-2 py-3 shadow-md'>
      {/* Conditionally render the Dashboard text or the search bar */}
      {!isSearchVisible ? (
        <div className='flex gap-1 items-center'>
          <Sheet>
            <SheetTrigger>
              <Menu className='w-6 h-6' />
            </SheetTrigger>
            <SheetContent side='left' className='lg:w-80'>
              <SheetHeader>
                <SheetTitle>Walkability</SheetTitle>
                <SheetDescription>Give a rating to your location</SheetDescription>
              </SheetHeader>
              <div className='flex flex-col justify-between h-full mt-4'>
                <div>
                  <Link href='/add-review'>
                    <p className='w-full hover:bg-green-100 hover:cursor-pointer p-2 rounded-md'>Rate Street</p>
                  </Link>
                  {
                    isUserLogin ? <Link href='/profile'>
                    <p className='w-full hover:bg-green-100 hover:cursor-pointer p-2 rounded-md'>View Profile</p>
                  </Link> : null
                  }
                  {
                    isUserLogin ? (
                      <p className='w-full hover:bg-green-100 hover:cursor-pointer p-2 rounded-md'
                      onClick={(e) => {
                        e.preventDefault();
                        signOut({
                          callbackUrl: "/dashboard",
                        });
                      }}
                    >
                      Logout
                    </p>) : (
                      <Link href='/sign-in'>
                    <p className='w-full hover:bg-green-100 hover:cursor-pointer p-2 rounded-md'>Sign in</p>
                  </Link>
                    )
                  }
                  
                </div>

                {/* Sharing options trigger */}
                <Sheet>
                  <SheetTrigger asChild>
                    <div className='mb-28 flex items-center gap-2 w-full bg-green-100 hover:bg-green-200 hover:cursor-pointer p-2 rounded-md'>
                      <Share2 className='w-5 h-5' strokeWidth='1.5' />
                      Refer a friend
                    </div>
                  </SheetTrigger>

                  {/* Sharing options drawer */}
                  <SheetContent side='bottom'>
                    <SheetHeader>
                      <SheetTitle>Share with Friends</SheetTitle>
                      <SheetDescription>Select a platform to share</SheetDescription>
                    </SheetHeader>
                    <div className='flex gap-4 mt-4 overflow-x-auto'>
                      <button
                        onClick={() => handleShare('whatsapp')}
                        className='bg-green-100 hover:bg-green-200 p-2 rounded-md flex items-center gap-2'>
                        <Share2 className='w-5 h-5' /> WhatsApp
                      </button>

                      <button
                        onClick={() => handleShare('email')}
                        className='bg-green-100 hover:bg-green-200 p-2 rounded-md flex items-center gap-2'>
                        <Mail className='w-5 h-5' /> Email
                      </button>

                      <button
                        onClick={() => handleShare('twitter')}
                        className='bg-green-100 hover:bg-green-200 p-2 rounded-md flex items-center gap-2'>
                        <Twitter className='w-5 h-5' /> Twitter
                      </button>

                      <button
                        onClick={() => handleShare('sms')}
                        className='bg-green-100 hover:bg-green-200 p-2 rounded-md flex items-center gap-2'>
                        <MessageSquare className='w-5 h-5' /> SMS
                      </button>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </SheetContent>
          </Sheet>

          <h1 className='font-bold text-lg font-sans'>DASHBOARD</h1>
        </div>
      ) : (
        <div className='lg:hidden w-full relative'>
          <Search className='w-5 h-5 absolute top-1.5' stroke='#9d9d9d' strokeWidth={1.5} />
          <input
            type='text'
            placeholder="Search your street's condition"
            className='pl-6 pr-3 py-1 rounded-md outline-none lg:border-2 lg:border-green-500 w-full'
            onChange={handleInput}
            value={searchQuery}
          />
        </div>
      )}

      <div className='flex items-center lg:gap-6 md:gap-4 gap-2'>
        {/* <div className={`lg:block md:block hidden relative`}>
          <Search className='w-5 h-5 absolute top-2 left-2' stroke='#9d9d9d' strokeWidth='1.5' />
          <input
            type='text'
            placeholder="Search your street's condition"
            className='pl-8 pr-3 py-1 rounded-md outline-none border-2 border-green-500 w-64'
            onChange={handleInput}
            value={searchQuery}
          />
        </div> */}

        {/* Button for mobile view */}
        {/* <div className='lg:hidden'>
          <button onClick={toggleSearch}>
            {isSearchVisible ? (
              <X className='w-5 h-5 mt-2' stroke='#9d9d9d' strokeWidth='3' />
            ) : (
              <Search className='w-5 h-5 mt-2' stroke='#9d9d9d' strokeWidth='3' />
            )}
          </button>
        </div> */}

        <Button asChild>
          <Link href='/add-review'>Rate street</Link>
        </Button>
      </div>
    </div>
  );
};

export default DashboardNavbar;
