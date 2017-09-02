function mixins(...otherClass){
    return (targetClass)=>{
        Object.assign(targetClass.prototype, ...otherClass);
    }
}

/**
 * 此方法用于实现class多继承
 * @param derivedCtor 
 * @param baseCtors 
 */
function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        })
    });
}

export { mixins, applyMixins };