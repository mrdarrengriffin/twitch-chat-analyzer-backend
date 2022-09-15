export class URLHelper {

    static objectToURLParams(object: object, keepEmptyValues: boolean = false){
        let params = [];
        Object.keys(object).forEach((index) => {
            const value = object[index];
            if(!value && !keepEmptyValues){
                return;
            }
            params.push(`${index}=${value}`)
        });
        return params.join('&');
    }

}