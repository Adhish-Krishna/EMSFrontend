
const API_URL = (import.meta.env.VITE_ENV === 'dev') ? "/api" : import.meta.env.VITE_BASE_API_URL;


const postData = async(url:string,formData:any) =>{
    const response = await fetch(`${API_URL}/${url}`,{
        method:'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify(formData),
        credentials: 'include'
    })
    const data = await response.json()
    if(response.ok === false){
        throw new Error(data.message)
    } 
    return data
}

const getDatawithRefreshToken = async<T> (role:"admin" | "global") : Promise< (url:string) => Promise<T> > =>  {
    return async (url: string): Promise<T> => {
        let response = await fetch(`${API_URL}/${url}`, {
            credentials: 'include', 
        });
    
        let data = await response.json();
        if(response.status === 401){
            const RefreshTokenresponse = await fetch(`${API_URL}/auth/${role}/getnewaccesstoken`,{
                credentials: 'include', 
            })

            if(RefreshTokenresponse.status === 200){
                response = await fetch(`${API_URL}/${url}`, {
                    credentials: 'include', 
                });
                data = response.json()
            }
            else{
                throw new Error(data?.message || "Something went Wrong")
            }
        }
    
        if (!response.ok) {
            throw new Error(data?.message || 'Something went wrong');
        }
    
        
    
        return data as T;
    };
}
const getBlob = async (url: string): Promise<Blob> => {
    const response = await fetch(`${API_URL}/${url}`, {
        credentials: 'include',
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to fetch blob data');
    }

    return await response.blob();
};


export {postData,getDatawithRefreshToken,getBlob}