import CPage, { Component } from './compile';
import Dom from './Dom';
import STore from './store';
const Store:any = new STore('user');
import Cookie from './cache/cookie';

export default CPage;
export { Component, Dom, Store, Cookie };

(<any>window).Cpage = new CPage();