export class Cookie {
    setCookie(name, value, options = {}) {
        let cookieStr = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

        if (options.maxAge) {
            cookieStr += `; max-age=${options.maxAge}`;
        }
        
        if (options.expires) {
            cookieStr += `; expires=${options.expires.toUTCString()}`;
        }
        
        if (options.path) {
            cookieStr += `; path=${options.path}`;
        }
        
        if (options.domain) {
            cookieStr += `; domain=${options.domain}`;
        }
        
        if (options.secure) {
            cookieStr += `; secure`;
        }
        
        if (options.sameSite) {
            cookieStr += `; samesite=${options.sameSite}`;
        }

        document.cookie = cookieStr;
    }
    
    unsetCookie(name) {
        document.cookie = `${encodeURIComponent(name)}=; max-age=-1; path=/`;
    }
    
    getCookie(name) {
        const cookies = document.cookie.split('; ').reduce((acc, cookieStr) => {
            const [key, val] = cookieStr.split('=');
            acc[decodeURIComponent(key)] = decodeURIComponent(val);
            return acc;
        }, {});

        return cookies[name];
    }
}
