class CustomPromise {
  constructor(executor) {
    this.state = 'pending';
    this.value = undefined;
    this.error = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === 'pending') {
        this.state = 'fulfilled';
        this.value = value;
        this.onResolvedCallbacks.forEach(callback => callback(value));
      }
    };

    const reject = (error) => {
      if (this.state === 'pending') {
        this.state = 'rejected';
        this.error = error;
        this.onRejectedCallbacks.forEach(callback => callback(error));
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }
  then(onResolved, onRejected) {
    return new CustomPromise((resolve, reject) => {
        const handleCallback = (callback, valueOrError) => {
            setTimeout(() => {
                try {
                    const result = callback ? callback(valueOrError) : valueOrError;
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            }, 0);
        };

        if (this.state === 'fulfilled') {
            handleCallback(onResolved, this.value);
        } else if (this.state === 'rejected') {
            handleCallback(onRejected, this.error);
        } else if (this.state === 'pending') {
            this.onResolvedCallbacks.push(value => handleCallback(onResolved, value));
            this.onRejectedCallbacks.push(error => handleCallback(onRejected, error));
        }
    });
}
  catch(onRejected){
    return this.then(null,onRejected)
  }
}

function fetchData(){
    return new CustomPromise((resolve,reject) =>{
        fetch('https://dummyjson.com/users?limit=3')
        .then(Response =>{
            if(!Response.ok){
                console.log("failed to fetch data" + Response)
                throw new Error("failed to fetch data");
            }
            return Response.json();
        })
        .then(data =>{
            resolve(data);
            console.log(data.users)
        })
        .catch(error=>{
            reject(error)
            console.log(error)
        })
    })
}

fetchData();