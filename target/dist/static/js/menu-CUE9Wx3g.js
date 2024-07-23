import{l as N}from"./socket.io-client-CFD4C2bo.js";import{m as $,h as E,P as w,j as y}from"./index-BzwtatPw.js";import"./store-BGvsPsWR.js";import{u as x}from"./index-OBXFyj3D.js";import{c as D,a as k}from"./element-plus-DaJS5H-O.js";import{D as M,B as v,v as T}from"./lodash-es-I-EvhVFk.js";function R(){const{route:m,router:f}=x(),{host:d}=$.config("helper");let p;function u(t){p||(p=N(`${d}/code`,{transports:["websocket"]}),p&&(p.on("connect",()=>{let r="",i="",c=!1,n;p==null||p.on("data",e=>{if(c=e.isEnd,e.isEnd){if(m.path!="/helper/ai-code"){const s=D({title:"提示",message:"Ai自动生成代码完成，点击查看",duration:0,onClick(){f.push("/helper/ai-code"),s.close()}})}}else try{e.content.includes(`
`)&&!r&&(e.content=e.content.replace(/\n/,"")),e.content=e.content.replace(/```/g,"").replace(/typescript/g,""),r+=e.content||""}catch{}n||(n=setInterval(()=>{var l,h;const s=r[i.length]||"";!s&&c?(r="",i="",c=!1,clearInterval(n),n=null,(l=t.onComplete)==null||l.call(t)):(i+=s,(h=t==null?void 0:t.onMessage)==null||h.call(t,i))},10))})}),p.on("disconnect",r=>{})))}function a(t){p==null||p.emit("instruct",t)}function o({columns:t,name:r}){return new Promise((i,c)=>{const n=t.filter(e=>!["id","crateTime","updateTime"].includes(e.propertyName));E({url:"/open/code/eps/matchType",method:"POST",data:{fields:n.map(e=>({type:e.type,field:e.propertyName,description:e.comment})),func:r}}).then(e=>{const s=e.split(",");n.forEach((l,h)=>{l.component=s[h]}),i(n)}).catch(c)})}return{connect:u,send:a,matchType:o}}function S(){const m={dict({comment:u}){const[a,...o]=u.split(" "),t=o.map(i=>{const[c,n]=i.split("-");return{label:n,value:isNaN(Number(c))?c:Number(c)}}),r={table:{label:a,dict:t,dictColor:!0,minWidth:120},form:{label:a,component:{name:"",options:t}}};return t[0]&&(r.form.value=t[0].value),r.form.component.name=o.length>4?"el-select":"el-radio-group",r},dict_multiple(u){var t,r;const{table:a,form:o}=m.dict(u);switch((t=o.component)!=null&&t.props||(o.component.props={}),o.value||(o.value=[]),(r=o.component)==null?void 0:r.name){case"el-select":Object.assign(o.component.props,{multiple:!0,filterable:!0});break;case"el-radio-group":o.component.name="el-checkbox-group";break}return{table:a,form:o}}};function f(u,a){var c;const o=u.propertyName;let t=u.comment,r,i=!1;return w.find(n=>{let e=!1;if(u.component?u.component==n.value&&(e=!0):n.test&&(e=!!n.test.find(s=>M(s)?s.test(o):v(s)?s(o):T(s)?s==o?!0:new RegExp(`${s}$`).test(o.toLocaleLowerCase()):!1)),n.group&&n.group.includes(o)&&n.group.some(s=>a.find(l=>l.propertyName==s))&&(n.group[0]==o?e=!0:i=!0),e)if(n.handler){const s=T(n.handler)?m[n.handler]:n.handler;v(s)&&(r=s(u))}else r={...n,test:void 0};return e}),r||(r=(c=w.find(n=>n.value=="input"))==null?void 0:c.render),t=t.split(" ")[0],{column:{label:t,prop:o,...r==null?void 0:r.table},item:{label:t,prop:o,...r==null?void 0:r.form},isHidden:i}}function d({router:u="",columns:a=[],prefix:o="",api:t=[]}){const r={items:[]},i={columns:[]};a.forEach(s=>{const{item:l,column:h,isHidden:C}=f(s,a);if(C)return!1;if(s.nullable||(l.required=!0),["createTime","updateTime","id","endTime","endDate"].includes(l.prop)||r.items.push(l),["id"].includes(l.prop)||i.columns.push(h),["startTime","startDate"].includes(l.prop)){const b=l.prop.replace("start","");if(a.find(g=>g.propertyName=="end"+b)){l.prop=b.toLocaleLowerCase();const g=l.prop=="time";l.label=g?"时间范围":"日期范围",l.hook="datetimeRange",l.component={name:"el-date-picker",props:{type:g?"datetimerange":"daterange",valueFormat:g?"YYYY-MM-DD HH:mm:ss":"YYYY-MM-DD 00:00:00",defaultTime:[new Date(2e3,1,1,0,0,0),new Date(2e3,1,1,23,59,59)]}}}}});const c=o.replace("/admin","service").split("/"),n=t.map(s=>s.path),e={add:n.includes("/add"),del:n.includes("/delete"),update:n.includes("/info")&&n.includes("/update"),page:n.includes("/page"),upsert:!0};if(e.upsert=e.add||e.update,e.del||e.upsert){const s=[];e.upsert&&s.push("edit"),e.del&&s.push("delete"),i.columns.push({type:"op",buttons:s})}return e.del?i.columns.unshift({type:"selection"}):i.columns.unshift({label:"#",type:"index"}),`<template>
            <cl-crud ref="Crud">
                <cl-row>
                    <!-- 刷新按钮 -->
                    <cl-refresh-btn />
                    ${e.add?`<!-- 新增按钮 -->
<cl-add-btn />`:""}
                    ${e.del?`<!-- 删除按钮 -->
<cl-multi-delete-btn />`:""}
                    <cl-flex1 />
                    <!-- 关键字搜索 -->
                    <cl-search-key />
                </cl-row>
        
                <cl-row>
                    <!-- 数据表格 -->
                    <cl-table ref="Table" />
                </cl-row>
        
                <cl-row>
                    <cl-flex1 />
                    <!-- 分页控件 -->
                    <cl-pagination />
                </cl-row>
        
                <!-- 新增、编辑 -->
                <cl-upsert ref="Upsert" />
            </cl-crud>
        </template>
        
        <script lang="ts" name="${u.replace(/^\//,"").replace(/\//g,"-")}" setup>
        import { useCrud, useTable, useUpsert } from "@cool-vue/crud";
        import { useCool } from "/@/cool";
        
        const { service } = useCool();
        
        // cl-upsert
        const Upsert = useUpsert(${p(r)});
        
        // cl-table
        const Table = useTable(${p(i)});
        
        // cl-crud
        const Crud = useCrud(
            {
                service: ${c.join(".")}
            },
            (app) => {
                app.refresh();
            }
        );
        <\/script>`}function p(u){const a=[];let o=JSON.stringify(u,(t,r)=>{if(v(r)){const i=r.toString();return a.push([JSON.stringify({[t]:i}),i]),i}else return r});return a.forEach(t=>{o=o.replace(t[0].substring(1,t[0].length-1),t[1])}),o}return{handler:m,createVue:d,createComponent:f,toCodeString:p}}function U(){const{createVue:m}=S();function f(d){return new Promise((p,u)=>{var a;d.viewPath=`modules/${d.module}/views${(a=d.router)==null?void 0:a.replace(`/${d.module}`,"")}.vue`,y.base.sys.menu.add({type:1,isShow:!0,keepAlive:!0,...d,api:void 0,code:void 0,columns:void 0}).then(o=>{var r;const t=(r=d.api)==null?void 0:r.map(i=>{var n;const c={type:2,parentId:o.id,name:i.summary||i.path,perms:[i.path]};return i.path=="/update"&&(n=d.api)!=null&&n.find(e=>e.path=="/info")&&c.perms.push("/info"),{...c,perms:c.perms.map(e=>{var s;return(((s=d.prefix)==null?void 0:s.replace("/admin/",""))+e).replace(/\//g,":")}).join(",")}});y.base.sys.menu.add(t).then(()=>{p(()=>{y.request({url:"/__cool_createMenu",method:"POST",proxy:!1,data:{code:m(d),...d}}).then(()=>{location.reload()})})})}).catch(o=>{k.error(o.message),u()})})}return{create:f,createVue:m}}export{U as a,R as u};
