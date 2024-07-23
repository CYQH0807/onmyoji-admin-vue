import{d as m,Y as r,o as p,c as u,i as t,F as d}from"./@vue.runtime-core-B2X3lOUZ.js";import{r as s}from"./@vue.reactivity-V6IlnEmz.js";import"./@vue.shared-D-bMerGS.js";const c=m({name:"undefined"}),V=m({...c,setup(i){const n=s('<p><span style="font-size: 22px;"><em>富文本编</em></span><span style="color: rgb(216, 68, 147); font-size: 22px;"><em>辑器</em></span></p>'),a=s(`class User {
  main() {
    console.log('Name', 'COOL')
  }
}

const user = new User();
user.main();
`);return(f,e)=>{const l=r("cl-editor-preview");return p(),u(d,null,[t(l,{modelValue:n.value,"onUpdate:modelValue":e[0]||(e[0]=o=>n.value=o),name:"wang",text:"查看内容"},null,8,["modelValue"]),t(l,{modelValue:a.value,"onUpdate:modelValue":e[1]||(e[1]=o=>a.value=o),name:"monaco",props:{language:"typescript"},text:"查看代码"},null,8,["modelValue"])],64)}}});export{V as default};
