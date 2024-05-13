import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react"
import { app } from "../firebase";


export default function CreateListing() {
    const [formData, setFormData] = useState({
        imageUrls: [],
    })
    const [imageUploadError, setImageUploadError] = useState(false)
    console.log(formData)
    const [files, setFile] = useState([])
    const [uploading, setUploading] = useState(false)

    const handleImageSubmit = ()=>{
        if (files.length > 0 && files.length + formData.imageUrls.length < 7){
            setUploading(true)
            setImageUploadError(false)
            const promises = [];
            for (let i = 0; i < files.length; i++){
                promises.push(storageItem(files[i]))
            }
            Promise.all(promises).then((urls)=>{
                setFormData({...formData, 
                    imageUrls: formData.imageUrls.concat(urls)
                })  
                setImageUploadError(false);
                setUploading(false)
            }).catch((error)=>{
                setImageUploadError('Image upload failed (2 mb per image')
                setUploading(false)
            })
        }else{
            setImageUploadError("You can only upload 6 images")
            setUploading(false)
        }
    }

    const storageItem = async (file)=>{
        return new Promise((resolve, reject)=>{
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file)
            uploadTask.on(
                "state_changed",
                (snapshot)=>{
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) *100
                    console.log(`upload is ${progress}% done`)
                },
                (error)=>{
                    reject(error)
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl)=>{
                        resolve(downloadUrl)
                    })
                }
            )
        })
    }

    const handleRemoveImage = (index)=>{
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i)=> i !== index)
        })
    }

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
                <p>
                    <span className="font-semibold">Images:</span>
                    <span className="font-normal text-gray-600 ml-2">The first image will be the cover (Max 6)</span>
                </p>
                <div className="gap-4 flex">
                    <input onChange={(e)=>setFile(e.target.files)} className="p-3 border border-gray-300 rounded w-full bg-white" type="file" name="" id="images" accept="image/*" multiple/>
                    <button type="button" disabled={uploading} onClick={handleImageSubmit} className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-85">
                    {uploading? "Loading..." : "Upload"}
                    </button>
                </div>
                <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index)=>(
                        <div key={url} className="flex justify-between p-3 border items-center">
                            <img src={url} alt="Pictures" className="w-20 h-20 object-contain rounded-lg" />
                            <button type="button" onClick={()=>handleRemoveImage(index)} className="text-red-700 rounded-lg uppercase hover: opacity-95">Delete</button>
                        </div>
                    ))
                }
                <button className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">Create listing</button>
            </div>
        </form>
    </main>
  )
}
