"use client";
/* eslint-disable @next/next/no-img-element -- private textbook pages use a controlled route and must not pass through an image optimizer */
import Link from "next/link";
import { useState } from "react";
import { getTextbookPage } from "@/content/textbooks/bonjour-francais-1/page-map";
import { textbookUrl } from "@/lib/textbook-links";

export function TextbookReader({lessonId,pdfPageIndex,min,max,sourceBbox}:{lessonId:string;pdfPageIndex:number;min:number;max:number;sourceBbox?:{x:number;y:number;width:number;height:number}|null}){
  const [zoom,setZoom]=useState(100); const page=getTextbookPage(pdfPageIndex);
  return <section className="textbook-reader"><header><div><strong>教材原文</strong><span>教材第 {page?.printedPageNumber??"—"} 页 · PDF 第 {pdfPageIndex+1} 页</span></div><div className="reader-tools"><button onClick={()=>setZoom(Math.max(70,zoom-10))} aria-label="缩小">−</button><span>{zoom}%</span><button onClick={()=>setZoom(Math.min(180,zoom+10))} aria-label="放大">＋</button></div></header><div className="reader-canvas"><img src={`/api/textbooks/bonjour-francais-1/pages/${pdfPageIndex}`} alt={`《你好！法语 1》教材第 ${page?.printedPageNumber??"未知"} 页`} style={{width:`${zoom}%`}}/>{sourceBbox&&<div className="page-highlight" aria-label="搜索匹配位置" style={{left:`${sourceBbox.x*100}%`,top:`${sourceBbox.y*100}%`,width:`${sourceBbox.width*100}%`,height:`${sourceBbox.height*100}%`}}/>}</div><footer><Link className={pdfPageIndex<=min?"disabled":""} href={textbookUrl({lessonId,pdfPageIndex:Math.max(min,pdfPageIndex-1)})}>← 上一页</Link><form action={`/courses/${lessonId}`}><input type="hidden" name="mode" value="textbook"/><label>PDF 页码 <input name="pdfPageNumber" type="number" min={min+1} max={max+1} defaultValue={pdfPageIndex+1}/></label><button type="submit">跳转</button></form><Link className={pdfPageIndex>=max?"disabled":""} href={textbookUrl({lessonId,pdfPageIndex:Math.min(max,pdfPageIndex+1)})}>下一页 →</Link></footer><p className="privacy-note">教材页面仅从本机受控读取，不提供原始 PDF 下载地址。</p></section>;
}
