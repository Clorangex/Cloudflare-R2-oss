export function get_auth_status(context) {
    var dopaths = context.request.url.split("/api/write/items/")
    if (dopaths.length < 2) {
        dopaths = context.request.url.split("/children/")
    }
    if (dopaths.length == 1) {
        return false
    }
    var dopath = dopaths[1]
    if(context.env["GUEST"] && context.request.method === "GET"){
        // if(dopath.startsWith("_$flaredrive$/thumbnails/"))return true;
        const allow_guest = context.env["GUEST"].split(",")
        for (var aa of allow_guest){
            if(aa == "*"){
                return true
            }else if(dopath.startsWith(aa)){
                return true
            }
        }
    }

    var headers = new Headers(context.request.headers);
    if (context.env["APIKEY"]) {
        if(headers.get('Apikey') == context.env["APIKEY"])return true;
    }
    if(!headers.get('Authorization'))return false
    
    const Authorization=headers.get('Authorization').split("Basic ")[1]
    const account = atob(Authorization);
    if(!account)return false
    if(!context.env[account])return false
    if(dopath.startsWith("_$flaredrive$/thumbnails/"))return true;
    const allow = context.env[account].split(",")
    for (var a of allow){
        if(a == "*"){
            return true
        }else if(dopath.startsWith(a)){
            return true
        }
    }
    return false;
  }
  