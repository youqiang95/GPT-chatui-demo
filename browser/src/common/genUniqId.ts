// singleton
class UniqIdGenerator {
    private static instance: UniqIdGenerator;
    private lastTimeStampStr: string;
    private lastCount: number 
    private constructor(){
        this.lastTimeStampStr = new Date().getTime().toString()
        this.lastCount = 0
    }

    public static getInstance(): UniqIdGenerator {
        if (!UniqIdGenerator.instance) {
            UniqIdGenerator.instance = new UniqIdGenerator();
        }
        return UniqIdGenerator.instance;
    }

    public genUniqId = ()=>{
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0,
              v = c === 'x' ? r : (r & 0x3) | 0x8
            return v.toString(16)
        })
        const ts = new Date().getTime().toString()
        if(ts === this.lastTimeStampStr){
            this.lastCount += 1
        }
        else{
            this.lastTimeStampStr = ts 
            this.lastCount = 0
        }
        return uuid + '-' + ts + '-' + this.lastCount.toString()
    }
  
}

export const genUniqId = () => {
    const uniqIdGenerator = UniqIdGenerator.getInstance()
    return uniqIdGenerator.genUniqId()
}