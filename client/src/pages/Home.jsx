import { Link } from "react-router-dom";
import Image02 from "../assets/02.webp"
import { useEffect, useState } from "react";
import ListingItems from "../components/ListingItems"



const Home = () => {
  const [rentListings, setRentListings] = useState([])
  const [saleListings, setSaleListings] = useState([])
  useEffect(()=>{
    const fetchRentListings = async ()=>{
      try {
        const res = await fetch('/api/listing/get?type=rent&limit=3')
        const data =  await res.json()
        setRentListings(data)
        fetchSaleListings()
      } catch (error) {
        console.log(error)
      }
    }
    const fetchSaleListings = async ()=>{
      try {
        const res =await fetch('/api/listing/get?type=sale&limit=3')
        const data = await res.json()
        setSaleListings(data)
      } catch (error) {
        console.log(error)
      }
      fetchSaleListings()
    }
    fetchRentListings()
  },[])
  return (
    <div>
      <div>
        <img className=' h-96 w-full object-cover' src={Image02} alt="" />
        <p className='absolute top-[33%] left-[13%] text-5xl font-semibold'>探索好屋</p>
        <Link className='absolute top-[43%] left-[13%] text-3xl font-semibold text-white hover:underline' to={'/search'}>現在開始</Link>
      </div>
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {rentListings.length >0 && rentListings &&(
          <div className=" my-3">
            <div>
              <Link className='text-md text-slate-700 hover:underline font-semibold' to={'/search?type=rent'}>出租的好屋</Link>
            </div>
            <div className='flex flex-wrap gap-4 my-3'>
              {rentListings.map((listing) => (
                <ListingItems listing={listing} key={listing._id} />
              ))}
            </div>
            <div>
              <Link className='text-md text-slate-700 hover:underline font-semibold' to={'/search?type=sale'}>出售的好屋</Link>
            </div>
            <div className='flex flex-wrap gap-4 my-3'>
              {saleListings.map((listing) => (
                <ListingItems listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;