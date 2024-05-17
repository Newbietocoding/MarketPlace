import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react"
import { app } from "../firebase";
import { useSelector } from "react-redux";
import {useNavigate, useParams} from "react-router-dom"


export default function UpdateListing() {
    const {currentUser} = useSelector(state=>state.user)
    const [formData, setFormData] = useState({
        imageUrls: [],
        name:"",
        description:"",
        address:"",
        type:"rent",
        bedrooms:1,
        bathrooms:1,
        regularPrice:50,
        discountPrice:50, 
        offer:false,
        parking:false,
        furnished:false,
    })
    const [imageUploadError, setImageUploadError] = useState(false)
    const [files, setFiles] = useState([])
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const params = useParams()

    useEffect(()=>{
        const fetchListing = async()=>{
            const listingId = params.listingId
            const res = await fetch(`/api/listing/get/${listingId}`)
            const data = await res.json()
            if (data.success === false){
                console.log(data.message)
                return
            }
            setFormData(data)
        }
        fetchListing()
    },[])

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
                setImageUploadError('相片最大2MB')
                setUploading(false)
            })
        }else{
            setImageUploadError("最多上傳6張相片")
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
    const handleChange = (e) =>{
        if (e.target.id == "sale" || e.target.id == "rent"){
            setFormData({
                ...formData,
                type:e.target.id
            })
        }
        if (e.target.id == "parking" || e.target.id == "furnished" || e.target.id == "offer"){
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked,
            })
        }
        if (e.target.type === 'number' || e.target.type ==='text' || e.target.type === 'textarea'){
            setFormData({
                ...formData,
                [e.target.id]: e.target.value,
            })
        }
    }

    const handleSubmit = async(e)=>{
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1){
                return setError("You must upload at least one image")
            }
            if (+formData.regularPrice < +formData.discountPrice){
                return setError("The discount Price must be lower the regular price ")
            } 
            setLoading(true);
            setError(false)
            const res = await fetch(`/api/listing/update/${params.listingId}`,{
                method: "POST",
                headers:{
                    "Content-Type" : "application/json",
                },
                body:JSON.stringify({
                    ...formData,
                    userRef:currentUser._id,
                }),  
            })
            const data = await res.json()
            setLoading(false)
            if (data.success === false){
                setError(data.message)
            }
            navigate(`/listing/${data._id}`)
        } catch (error) {
            setError(error.message)
            setLoading(false)
        }
    }

  return (
    <main className=' p-3 max-w-4xl mx-auto '>
        <h1 className=' text-3xl font-semibold text-center my-7'>更新物件</h1>
        <form onSubmit={handleSubmit} className=' flex flex-col sm:flex-row gap-4 '>
            <div className=' flex flex-col gap-4 flex-1 '>
                <input 
                className=' border p-3 rounded-lg' 
                maxLength={'62'} 
                minLength={'10'} 
                required type="text" 
                placeholder='關於此屋' 
                id="name" 
                onChange={handleChange}
                value={formData.name}
                />
                <textarea 
                className=' border p-3 rounded-lg' 
                 required type="text" 
                 placeholder='Description' 
                 id="description" 
                onChange={handleChange}
                value={formData.description}
                 />
                <input 
                className=' border p-3 rounded-lg' 
                required 
                type="text" 
                placeholder='地址' 
                id="address"
                onChange={handleChange}
                value={formData.address}
                />
                <div className='flex gap-6 flex-wrap'>
                    <div className=' flex gap-2'>
                        <input 
                        type="checkbox" 
                        name="sale" 
                        id="sale" 
                        className='w-5'
                        onChange={handleChange}
                        checked={formData.type === "sale"} 
                        />
                        <span>出售</span>
                    </div>
                    <div className=' flex gap-2'>
                        <input 
                        type="checkbox" 
                        name="rent" 
                        id="rent" 
                        className='w-5'
                        onChange={handleChange}
                        checked={formData.type === "rent"} 
                         />
                        <span>出租</span>
                    </div>
                    <div className=' flex gap-2'>
                        <input 
                        type="checkbox" 
                        name="parking" 
                        id="parking" 
                        className='w-5'
                        onChange={handleChange}
                        checked={formData.parking} 
                         />
                        <span>車位</span>
                    </div>
                    <div className=' flex gap-2'>
                        <input 
                        type="checkbox" 
                        name="furnished" 
                        id="furnished" 
                        className='w-5' 
                        onChange={handleChange}
                        checked={formData.furnished} 
                        />
                        <span>家具</span>
                    </div>
                    <div className=' flex gap-2'>
                        <input 
                        type="checkbox" 
                        name="offer" 
                        id="offer" 
                        className='w-5' 
                        onChange={handleChange}
                        checked={formData.offer}     
                        />
                        <span>預售屋</span>
                    </div>
                </div>
                <div className=" flex flex-wrap gap-6">
                    <div className='flex items-center gap-2'>
                        <input 
                        className='p-3 border rounded-lg border-gray-300' 
                        type="number" 
                        id="bedrooms" 
                        min='1'
                        max='10'
                        required
                        onChange={handleChange}
                        value={formData.bedrooms} 
                         />
                        <p>臥室</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input 
                        className='p-3 border rounded-lg border-gray-300' 
                        type="number" 
                        id="bathrooms" 
                        min={'1'} 
                        max={'10'} 
                        required
                        onChange={handleChange}
                        value={formData.bathrooms} 
                         />
                        <p>浴室</p>
                    </div>
                    <div className='flex items-center gap-2'>
                        <input 
                        className='p-3 border rounded-lg border-gray-300' 
                        type="number" 
                        id="regularPrice" 
                        min='1'
                        max='10000000000000000000'
                        required
                        onChange={handleChange}
                        value={formData.regularPrice} 
                         />
                        <div className=' flex flex-col items-center '>
                            <p>價格</p>
                            {formData.type === 'rent' &&(
                                <span className='text-xs'>($ / 月)</span>
                            )}
                        </div>
                    </div>
                    {formData.offer &&(<div className='flex items-center gap-2'>
                        <input 
                        className='p-3 border rounded-lg border-gray-300' 
                        type="number" 
                        id="discountPrice" 
                        min='1'
                        max='10000000000000000' 
                        required
                        onChange={handleChange}
                        value={formData.discountPrice} 
                         />
                        
                        <div className=' flex flex-col items-center '>
                            <p>優惠</p>
                            {formData.type === 'rent' &&(
                                <span className='text-xs'>($ / 月)</span>
                            )}
                        </div>
                    </div>) }
                </div>
            </div>  
            <div className="flex flex-col flex-1 gap-4">
                <p>
                    <span className="font-semibold">相片:</span>
                    <span className="font-normal text-gray-600 ml-2">第一張相片會是封面 (最多 6)</span>
                </p>
                <div className="gap-4 flex">
                    <input 
                    onChange={(e)=>setFiles(e.target.files)} 
                    className="p-3 border border-gray-300 rounded w-full bg-white" 
                    type="file" 
                    name="" 
                    id="images" 
                    accept="image/*" 
                    multiple
                    />
                    <button 
                    type="button" 
                    disabled={uploading} 
                    onClick={handleImageSubmit} 
                    className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-85">
                    {uploading? "Loading..." : "上傳"}
                    </button>
                </div>
                <p className="text-red-700 text-sm">{imageUploadError && imageUploadError}</p>
                {
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index)=>(
                        <div key={url} className="flex justify-between p-3 border items-center">
                            <img src={url} alt="Pictures" className="w-20 h-20 object-contain rounded-lg" />
                            <button type="button" onClick={()=>handleRemoveImage(index)} className="text-red-700 rounded-lg uppercase hover: opacity-95">刪除</button>
                        </div>
                    ))
                }
                <button disabled={loading || uploading} className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
                {loading? "Loading" :"更新" }
                </button>
                {error && <p className="text-red-700 text-sm">{error}</p>}
            </div>
        </form>
    </main>
  )
}
