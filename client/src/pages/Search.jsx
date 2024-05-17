import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListingItems from '../components/ListingItems';

export default function Search() {
  const navigate = useNavigate();
  const [sideBarData, setSideBarData] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    offer: false,
    sort: 'created_at',
    order: 'desc',
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false)

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSideBarData({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }

    const fetchListings = async () => {
      setShowMore(false)
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8){
        setShowMore(true)
      }else{
        setShowMore(false)
      }
      setListings(data);
      setLoading(false);
    }
    

    fetchListings()
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale') {
      setSideBarData({ ...sideBarData, type: e.target.id });
    }

    if (e.target.id === 'searchTerm') {
      setSideBarData({ ...sideBarData, searchTerm: e.target.value });
    }

    if (e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setSideBarData({
        ...sideBarData,
        [e.target.id]: e.target.checked || e.target.checked === 'true' ? true : false,
      });
    }

    if (e.target.id === 'sort_order') {
      const sort = e.target.value.split('_')[0] || 'created_at';
      const order = e.target.value.split('_')[1] || 'desc';
      setSideBarData({ ...sideBarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sideBarData.searchTerm);
    urlParams.set('type', sideBarData.type);
    urlParams.set('parking', sideBarData.parking);
    urlParams.set('furnished', sideBarData.furnished);
    urlParams.set('offer', sideBarData.offer);
    urlParams.set('sort', sideBarData.sort);
    urlParams.set('order', sideBarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  const onShowMoreClick = async ()=>{
    const numberOfListings = listings.length;
    const startIndex = numberOfListings
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex)
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`)  
    const data = await res.json();
    if (data.length   <9){
      setShowMore(false);
    }
    setListings([...listings, ...data])
  }


  return (
    <div className='flex flex-col md:flex-row'>
      <div className='p-7 border-b-2 sm:border-r-2 md:min-h-screen'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>搜尋建案:</label>
            <input
              type='text'
              id='searchTerm'
              placeholder='搜尋...'
              className='border rounded-lg p-3 w-full'
              value={sideBarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>分類:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='all'
                className='w-5'
                onChange={handleChange}
                checked={sideBarData.type === 'all'}
              />
              <span>租 & 售</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='rent'
                className='w-5'
                onChange={handleChange}
                checked={sideBarData.type === 'rent'}
              />
              <span>出租</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='sale'
                className='w-5'
                onChange={handleChange}
                checked={sideBarData.type === 'sale'}
              />
              <span>出售</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='offer'
                className='w-5'
                onChange={handleChange}
                checked={sideBarData.offer}
              />
              <span>預售屋</span>
            </div>
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='font-semibold'>附加:</label>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='parking'
                className='w-5'
                onChange={handleChange}
                checked={sideBarData.parking}
              />
              <span>停車位</span>
            </div>
            <div className='flex gap-2'>
              <input
                type='checkbox'
                id='furnished'
                className='w-5'
                onChange={handleChange}
                checked={sideBarData.furnished}
              />
              <span>家具</span>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>分類</label>
            <select
              onChange={handleChange}
              defaultValue={'created_at_desc'}
              id='sort_order'
              className='border rounded-lg p-3'
            >
              <option value='createdAt_desc'>最新</option>
              <option value='createdAt_asc'>最舊</option>
              <option value='regularPrice_desc'>價格高至低</option>
              <option value='regularPrice_asc'>價格低至高</option>
            </select>
          </div>
          <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
            搜尋
          </button>
        </form>
      </div>
      <div >
        <h1 className='text-3xl font-semibold border-b p-3'>搜尋結果:</h1>
        <div className='p-7 flex flex-wrap gap-4'>
        {!loading &&listings.length === 0 &&(
            <p className='text-xl text-slate-700'>查無資料</p>
        ) }
        {loading && (
            <p className='text-xl text-slate-700'>Loading</p>
        )}
        {!loading && listings && listings.map((listing)=>(
            <ListingItems key={listing._id} listing={listing}/>
        ))}
        {showMore && (
          <button className='text-green-700 hover:underline text-center w-full' onClick={onShowMoreClick}>
            顯示更多
          </button>
        )}
        </div>
      </div>
    </div>
  );
}
