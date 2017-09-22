import * as $log from '../log';
import Util from '../util';

/**
 * 验证组件的状态
 * @param component 组件
 */
export default function componentGuard(component){
    // 验证组件名称
    if(!component.name){
        return;
    }
    if(component.name){
        if(Util.type(component.name) != 'string')
            $log.error('组件'+component.name+'的名称必须为字符串');
    }

    // 验证组件components属性
    if(component.components){
        if(Util.type(component.components) != 'array'){
            $log.error('组件'+component.name + '的components属性应为数组！');
        }
    }

    // 验证组件style属性
    if(component.style){
        if(Util.type(component.style) != 'string'){
            $log.error('组件'+component.name + '的style属性应为字符！');
        }
    }

     // 验证组件styleeId属性
    if(component.styleId){
        if(Util.type(component.styleId) != 'string'){
            $log.error('组件'+component.name + '的styleId属性应为字符！');
        }
        if(document.querySelector(component.styleId) == undefined){
            $log.error('节点'+component.styleId+'不存在');
        }
    }

    // 验证组件template属性
    if(component.template){
        if(Util.type(component.template) != 'string'){
            $log.error('组件'+component.name + '的template属性应为字符！');
        }
    }

     // 验证组件templateId属性
    if(component.templateId){
        if(Util.type(component.templateId) != 'string'){
            $log.error('组件'+component.name + '的templateId属性应为字符！');
        }
        if(document.querySelector(component.templateId) == undefined){
            $log.error('节点'+component.templateId+'不存在');
        }
    }

    // 验证组件data属性
    if(component.data){
        if(Util.type(component.data) != 'object'){
            $log.error('组件'+component.name + '的data属性应为对象！');
        }
    }

    // 验证组件props属性
    if(component.props){
        if(Util.type(component.props) != 'object'){
            $log.error('组件'+component.name + '的props属性应为对象！');
        }
        // 验证type类型
        Object.entries(component.props).forEach(v=>{
            if(Util.type(v[1]['default']) != v[1]['type']){
                $log.error('组件'+component.name + 'props属性中元素'+ v[0] +'的default值非'+v[1]['type']+'类型！');
            }
        });
    }

    // 验证组件props方法
    if(component.beforeRender){
        if(Util.type(component.beforeRender) != 'function'){
            $log.error('组件'+component.name + '的beforeRender属性应为函数！');
        }
    }

    // 验证组件render方法
    if(component.render){
        if(Util.type(component.render) != 'function'){
            $log.error('组件'+component.name + '的render属性应为函数！');
        }
    }else {
        return;
    }
}