import{c as f,r as j,t as p,j as e}from"./client-2BYdGpad.js";import{u as y,D as N,U as v}from"./uploadthing-DY_IkqgG.js";import{B as l}from"./button-zkXCufN8.js";import{X as b}from"./x-C8D_GtzZ.js";/**
 * @license lucide-react v0.476.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const U=[["path",{d:"M16 5h6",key:"1vod17"}],["path",{d:"M19 2v6",key:"4bpg5p"}],["path",{d:"M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5",key:"1ue2ih"}],["path",{d:"m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21",key:"1xmnt7"}],["circle",{cx:"9",cy:"9",r:"2",key:"af1f0g"}]],k=f("ImagePlus",U);function C({value:c,onChange:i,disabled:d}){const[a,r]=j.useState(null),x=()=>{i("")},{startUpload:u,isUploading:t}=y("categoryImage",{onClientUploadComplete:s=>{s&&(i(s[0].url),r(null),p.success("Image uploaded successfully"))},onUploadError:s=>{p.error(`Upload failed: ${s.message}`)}}),h=()=>{a&&u([a])};return e.jsx("div",{className:"space-y-4",children:c?e.jsxs("div",{className:"relative h-[200px] w-[200px] rounded-md overflow-hidden",children:[e.jsx("div",{className:"absolute top-2 right-2 z-10",children:e.jsx(l,{type:"button",variant:"destructive",size:"sm",className:"flex h-7 w-7 items-center justify-center rounded-full p-0",onClick:x,disabled:d||t,children:e.jsx(b,{className:"h-4 w-4"})})}),e.jsx("img",{className:"object-cover",alt:"分类图片",src:c})]}):e.jsx(N,{disabled:d||t,maxFiles:1,maxSize:4*1024*1024,accept:{"image/*":[".jpeg",".jpg",".png",".gif",".webp"]},onDrop:s=>r(s[0]),children:({getRootProps:s,getInputProps:g,isDragActive:n,fileRejections:m})=>e.jsx("div",{className:"space-y-4",children:e.jsxs("div",{...s(),className:`
                  border-2 border-dashed 
                  p-8
                  h-[200px]
                  rounded-lg 
                  transition 
                  cursor-pointer
                  flex flex-col items-center justify-center
                  relative
                  ${n?"border-primary bg-primary/10":"border-muted hover:border-muted-foreground"}
                  ${t?"opacity-50 cursor-not-allowed":""}
                  ${m.length>0?"border-destructive":""}
                `,children:[e.jsx("input",{...g()}),a?e.jsxs("div",{className:"space-y-4 text-center",children:[e.jsxs("div",{className:"flex items-center justify-center flex-col",children:[e.jsx("p",{className:"text-sm text-muted-foreground",children:a.name}),e.jsx(l,{type:"button",onClick:o=>{o.stopPropagation(),r(null)},disabled:t,variant:"ghost",size:"sm",className:"mt-2",children:"Cancel"})]}),e.jsx(l,{type:"button",onClick:o=>{o.stopPropagation(),h()},disabled:t,size:"sm",children:t?"Uploading...":e.jsxs(e.Fragment,{children:[e.jsx(v,{className:"h-4 w-4 mr-2"}),"Confirm Upload"]})})]}):e.jsxs("div",{className:"text-center space-y-2",children:[e.jsx(k,{className:"mx-auto h-10 w-10 text-muted-foreground"}),e.jsx("p",{className:"text-sm text-muted-foreground",children:n?"Drop to upload":"Drop images here or click to select"}),m.length>0&&e.jsx("p",{className:"text-sm text-destructive",children:"File format is incorrect or exceeds size limit"}),e.jsx("p",{className:"text-xs text-muted-foreground",children:"Supported formats: JPG, PNG, GIF, WEBP (max 4MB)"})]})]})})})})}export{C as S};
