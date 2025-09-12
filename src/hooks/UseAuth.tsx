export default function UserAuth() {
    try{
        const _localStorage = localStorage.getItem('user');
        if(_localStorage){
            return JSON.parse(_localStorage);
        }
    } catch (error) {
        console.log(error);
    }
    return null;    
}