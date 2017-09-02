export default class Duff {
	private _array:Array<any>;
	private _fn:Function;

	constructor(array, fn){
		this._array = array;
		this._fn = fn;
	}

	get array(){
		return this._array;
	}

	set array(value:Array<any>){
		if(!Array.isArray(value)) return;
		this._array = value;
	}

	get fn(){
		return this._fn;
	}

	set fn(value:Function){
		if(value.constructor != Function) return;
		this._fn = value;
	}

	duff(){
		var iterations = Math.floor(this._array.length / 8);
        var leftover = this._array.length % 8;
        var i = 0;
         
        if(leftover > 0) {
            do {
                this._fn(this._array[i++]);
            }while(--leftover > 0);
        }
         
        do {
            this._fn(this._array[i++]);
            this._fn(this._array[i++]);
            this._fn(this._array[i++]);
            this._fn(this._array[i++]);
            this._fn(this._array[i++]);
            this._fn(this._array[i++]);
            this._fn(this._array[i++]);
            this._fn(this._array[i++]);
        }while(--iterations > 0);
	}
}