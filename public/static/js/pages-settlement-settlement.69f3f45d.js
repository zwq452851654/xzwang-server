(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-settlement-settlement"],{1655:function(t,e,i){"use strict";i.r(e);var a=i("176c"),n=i("479d");for(var s in n)"default"!==s&&function(t){i.d(e,t,(function(){return n[t]}))}(s);i("c057");var c,l=i("f0c5"),o=Object(l["a"])(n["default"],a["b"],a["c"],!1,null,"1e21413c",null,!1,a["a"],c);e["default"]=o.exports},"176c":function(t,e,i){"use strict";var a,n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-uni-view",{staticClass:"p w-100",staticStyle:{"padding-bottom":"60px"}},[a("v-uni-view",{staticClass:"card"},[a("v-uni-navigator",{attrs:{url:"../user/management"}},[a("v-uni-view",{staticClass:"bg-warning text-center select-address"},[t._v("添加收货地址")])],1)],1),a("v-uni-view",{staticClass:"mt-15"},[a("v-uni-view",{staticClass:"card"},[a("v-uni-view",{staticClass:"list-head"},[t._v("已选购商品")]),a("v-uni-view",{staticClass:"list-body"},t._l(10,(function(e){return a("v-uni-view",{key:e,staticClass:"p d-flex"},[a("v-uni-image",{staticStyle:{width:"60px",height:"60px"},attrs:{src:i("516e"),mode:"scaleToFill"}}),a("v-uni-view",{staticClass:"ml-10 d-flex flex-column ju-con-between"},[a("v-uni-view",{staticStyle:{"font-size":"14px"}},[t._v("我是标题王")]),a("v-uni-view",{staticStyle:{"font-size":"12px"}},[t._v("500g")]),a("v-uni-view",{staticStyle:{"font-size":"12px"}},[t._v("x1")])],1),a("v-uni-view",{staticClass:"ml-auto d-flex item-m-center font-size-3 color-red"},[t._v("￥100")])],1)})),1),a("v-uni-view",{staticClass:"list-foot d-flex ju-con-between"},[a("v-uni-view",[t._v("共4件")]),a("v-uni-view",[t._v("小计：￥100")])],1)],1),a("v-uni-view",{staticClass:"card mt-15"},[a("van-cell",{attrs:{title:"优惠券","is-link":!0}}),a("van-cell",{attrs:{title:"积分",label:"共1290，可用1000，抵扣￥10"}},[a("van-switch",{attrs:{size:"20px"},model:{value:t.integralChecked,callback:function(e){t.integralChecked=e},expression:"integralChecked"}})],1),a("van-cell",{attrs:{title:"备注","is-link":!0},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.open.apply(void 0,arguments)}}},[a("v-uni-view",{staticClass:"bz-con"},[t._v("备注内容")])],1),a("van-cell",{attrs:{title:"配送费",value:"0.5元"}}),a("van-cell",{attrs:{title:"支付方式","is-link":!0,"arrow-direction":"down",value:"支付宝"}}),a("v-uni-view",{staticClass:"p d-flex item-m-center"},[a("v-uni-image",{staticStyle:{width:"50px",height:"50px"},attrs:{src:i("516e"),mode:"scaleToFill"}}),a("v-uni-view",{staticClass:"ml-15"},[a("v-uni-view",[t._v("支付宝")]),a("v-uni-view",{staticClass:"color-ccc"},[t._v("安全可靠又便捷")])],1),a("v-uni-radio",{staticClass:"ml-auto",attrs:{value:"r1",checked:!0}})],1),a("v-uni-view",{staticClass:"p d-flex item-m-center"},[a("v-uni-image",{staticStyle:{width:"50px",height:"50px"},attrs:{src:i("516e"),mode:"scaleToFill"}}),a("v-uni-view",{staticClass:"ml-15"},[a("v-uni-view",[t._v("微信")]),a("v-uni-view",{staticClass:"color-ccc"},[t._v("使用微信安全支付")])],1),a("v-uni-radio",{staticClass:"ml-auto",attrs:{value:"r1",checked:!1}})],1),a("v-uni-view",{staticClass:"p d-flex item-m-center"},[a("v-uni-image",{staticStyle:{width:"50px",height:"50px"},attrs:{src:i("516e"),mode:"scaleToFill"}}),a("v-uni-view",{staticClass:"ml-15"},[a("v-uni-view",[t._v("线下支付")]),a("v-uni-view",{staticClass:"color-ccc"},[t._v("收货时扫描支付，灵活便捷")])],1),a("v-uni-radio",{staticClass:"ml-auto",attrs:{value:"r1",checked:!1}})],1)],1),a("v-uni-view",{staticClass:"card mt-15"})],1),a("van-submit-bar",{attrs:{price:3050,"button-text":"立即支付","safe-area-inset-bottom":!0},on:{submit:function(e){arguments[0]=e=t.$handleEvent(e),t.onSubmit.apply(void 0,arguments)}}},[a("v-uni-view",{staticStyle:{"padding-left":"10px","font-size":"10px"}},[t._v("已优惠￥5")])],1),a("uni-popup",{ref:"popup",attrs:{type:"bottom"}},[a("v-uni-view",{staticClass:"bz-box"},[a("v-uni-view",{staticClass:"p d-flex ju-con-between"},[a("van-icon",{attrs:{size:"20px",name:"arrow-down"},on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.closePopup.apply(void 0,arguments)}}}),a("v-uni-view",{staticClass:"text-center"},[t._v("添加备注")]),a("v-uni-view",{on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.closePopup.apply(void 0,arguments)}}},[t._v("完成")])],1),a("v-uni-textarea",{staticClass:"mt-15 bz-text",attrs:{maxlength:"50",placeholder:"如无接触收货,讲包裹挂在门把上..."}}),a("v-uni-view",{staticClass:"mt-15 color-ccc"},[t._v("快捷便签")]),a("v-uni-view",{staticClass:"d-flex flex-wrap-wrap"},t._l(10,(function(e){return a("v-uni-view",{key:e,staticClass:"bz-label"},[t._v("我是快捷标签")])})),1)],1)],1)],1)},s=[];i.d(e,"b",(function(){return n})),i.d(e,"c",(function(){return s})),i.d(e,"a",(function(){return a}))},"20fc":function(t,e,i){"use strict";var a=i("ee27");Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=a(i("bec4")),s={components:{uniPopup:n.default},data:function(){return{radio:"1",integralChecked:!0}},methods:{onSubmit:function(){},open:function(){this.$refs.popup.open()},closePopup:function(){this.$refs.popup.close()}}};e.default=s},"2bd5":function(t,e,i){var a=i("3837");"string"===typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);var n=i("4f06").default;n("4eece6e6",a,!0,{sourceMap:!1,shadowMode:!1})},3837:function(t,e,i){var a=i("24fb");e=a(!1),e.push([t.i,".select-address[data-v-1e21413c]{height:60px;line-height:60px;background-color:#fff;font-size:20px}.card[data-v-1e21413c]{\n\t/* padding: 10px; */border-radius:10px;background-color:#fff;overflow:hidden}.list-head[data-v-1e21413c]{height:40px;line-height:40px;padding-left:10px;border-bottom:1px solid hsla(0,0%,80%,.55)}.list-body[data-v-1e21413c]{max-height:350px;overflow-y:auto}.list-foot[data-v-1e21413c]{height:40px;line-height:40px;padding:0 10px;border-top:1px solid hsla(0,0%,80%,.55)}.bz-con[data-v-1e21413c]{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.bz-box[data-v-1e21413c]{height:90%;background-color:#fcfcfa;padding:10px 10px 80px 10px}.bz-text[data-v-1e21413c]{width:96%;height:140px;padding:5px 2%;border:1px solid #ccc}.bz-label[data-v-1e21413c]{padding:5px 8px;border:1px solid #ccc;margin:10px 10px 0 0;font-size:14px;border-radius:3px}",""]),t.exports=e},"479d":function(t,e,i){"use strict";i.r(e);var a=i("20fc"),n=i.n(a);for(var s in a)"default"!==s&&function(t){i.d(e,t,(function(){return a[t]}))}(s);e["default"]=n.a},"516e":function(t,e,i){t.exports=i.p+"static/img/cat.89cb4ea3.jpeg"},c057:function(t,e,i){"use strict";var a=i("2bd5"),n=i.n(a);n.a}}]);