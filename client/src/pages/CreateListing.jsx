

export default function CreateListing() {
  return (
    <main className=' p-3 max-w-4xl mx-auto '>
        <h1 className=' text-3xl font-semibold text-center my-7'>Create Listing</h1>
        <form className=' flex flex-col sm:flex-row gap-4 '>
            <div className=' flex flex-col gap-4 flex-1 '>
                <input className=' border p-3 rounded-lg' maxLength={'62'} minLength={'10'} required type="text" placeholder='Name' id="name" />
                <textarea className=' border p-3 rounded-lg'  required type="text" placeholder='Description' id="description" />
                <input className=' border p-3 rounded-lg' required type="text" placeholder='Address' id="Address" />
                <div className='flex gap-6 flex-wrap'>
                    <div className=' flex gap-2'>
                        <input type="checkbox" name="sale" id="sale" className='w-5' />
                        <span>Sell</span>
                    </div>
                    <div className=' flex gap-2'>
                        <input type="checkbox" name="sale" id="rent" className='w-5' />
                        <span>Rent</span>
                    </div>
                    <div className=' flex gap-2'>
                        <input type="checkbox" name="sale" id="parking" className='w-5' />
                        <span>Parking</span>
                    </div>
                    <div className=' flex gap-2'>
                        <input type="checkbox" name="sale" id="furnished" className='w-5' />
                        <span>Furnished</span>
                    </div>
                    <div className=' flex gap-2'>
                        <input type="checkbox" name="sale" id="Offer" className='w-5' />
                        <span>Offer</span>
                    </div>
                </div>
                <div className=" flex flex-wrap gap-6">
                    <div className='flex items-center gap-2'>
                        <input className='p-3 border rounded-lg border-gray-300' type="number" name="" id="bedrooms" min={'1'} max={'10'} required />
                        <p>臥室</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input className='p-3 border rounded-lg border-gray-300' type="number" name="" id="bathrooms" min={'1'} max={'10'} required />
                        <p>浴室</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input className='p-3 border rounded-lg border-gray-300' type="number" name="" id="regularPrice" min={'1'} max={'10'} required />
                        <div className=' flex flex-col items-center '>
                            <p>價格</p>
                            <span className='text-xs'>($ / month)</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input className='p-3 border rounded-lg border-gray-300' type="number" name="" id="descountPrice" min={'1'} max={'10'} required />
                        <div className=' flex flex-col items-center '>
                            <p>優惠</p>
                            <span className='text-xs'>($ / month)</span>
                        </div>
                    </div>
                </div>
            </div>  
            <div className="flex flex-col flex-1 gap-4">
                <p className="font-semibold">Images:
                    <span className="font-normal text-gray-600 ml-2">The first image will be the cover (Max 6)</span>
                </p>
                <div className="gap-4 flex">
                    <input className="p-3 border border-gray-300 rounded w-full" type="file" name="" id="images" accept="image/*" multiple/>
                    <button className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-85">Upload</button>
                </div>
                <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">Create listing</button>
            </div>
        </form>
    </main>
  )
}
