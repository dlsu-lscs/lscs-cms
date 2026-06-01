import Cookies from '../../node_modules/js-cookie/dist/js.cookie.mjs';

export default Cookies;
export const set = Cookies.set;
export const get = Cookies.get;
export const remove = Cookies.remove;
export const withAttributes = Cookies.withAttributes;
export const withConverter = Cookies.withConverter;
