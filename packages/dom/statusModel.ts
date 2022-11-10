import targetDom from './targetDom';
import Util from '../util';

/**
 * 节点是否包含某些属性
 */
export default class statusModel extends targetDom {
	constructor(selector) {
		super(selector);
	}

	// 判断节点是否拥有属性
	public hasAttrs() {
		for (let i of this.els) {
			if (i.hasAttributes()) {
				return true;
			} else {
				return false;
			}
		}
	}

	/**
	 * 判断节点是否有某个属性
	 * @param attr 属性名
	 */
	public hasAttr(attr) {
		if (attr && Util.type(attr) != 'string') {
			return;
		}
		for (let i of this.els) {
			if (i.hasAttribute(attr)) {
				return true;
			} else {
				return false;
			}
		}
	}

	/**
	 * 判断节点是否有某个class
	 * @param name class名称
	 */
	public hasClass(name) {
		if (name && Util.type(name) != 'string') {
			return;
		}
		for (let i of this.els) {
			if (i.classList.contains(name)) {
				return true;
			} else {
				return false;
			}
		}
	}
}