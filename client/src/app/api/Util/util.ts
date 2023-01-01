export function getCookie(key:string) {
    const b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
    return b ? b.pop() : "";
  }

  export function currencyFormat(amount:number){
    return '£' + (amount/100).toFixed(2);
  }


  export function convertObjToArray(obj:Object){
    return Object.keys(obj) ; // convert object to array
  }