import CPage, { Component } from './compile';
import Dom from './dom';
import STore from './store';
const Store:any = new STore('user');

export default CPage;
export { Component, Dom, Store };

(<any>window).Cpage = new CPage();