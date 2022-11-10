declare function mixins(...otherClass: any[]): (targetClass: any) => void;
/**
 * 此方法用于实现class多继承
 * @param derivedCtor
 * @param baseCtors
 */
declare function applyMixins(derivedCtor: any, baseCtors: any[]): void;
export { mixins, applyMixins };
