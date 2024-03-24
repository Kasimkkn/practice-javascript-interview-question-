export default class CustomPromise {
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
  
  then(onResolved,onRejected){
    return new CustomPromise((resolve,reject)=>{
        if(this.state==='fulfilled'){
            setTimeout(()=>{
                try {
                    const result = onResolved ? onResolved(this.value) : this.value;
                    resolve(result);
                } catch (error) {
                    reject(error)
                }
            },0)
        }
        else if(this.state==='rejected'){
            setTimeout(()=>{
                try {
                    const result = onRejected?onRejected(this.error) : this.error;
                    resolve(result);
                } catch (error) {
                    reject(error)
                }
            },0)
        }
        else if(this.state==='pending'){
            this.onResolvedCallbacks.push((value)=>{
                setTimeout(()=>{
                    try {
                        const result = onResolved ? onResolved(value) : value;
                        resolve(result);
                    } catch (error) {
                        reject(error)
                    }
                },0)
            })

            this.onRejectedCallbacks.push((error)=>{
                setTimeout(() => {
                    try {
                        const result = onRejected ? onRejected(error) : error;
                        resolve(result);
                    } catch (error) {
                        reject(error)
                    }
                }, 0);
            })
        }
    })
  }

  catch(onRejected){
    return this.then(null,onRejected)
  }
}
