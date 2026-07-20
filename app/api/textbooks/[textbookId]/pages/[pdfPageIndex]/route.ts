import { renderTextbookPage } from "@/lib/textbook-files";
import { resolveTextbookPageRequest } from "@/lib/textbook-page-request";

export const dynamic="force-dynamic";
export async function GET(_request:Request,{params}:{params:Promise<{textbookId:string;pdfPageIndex:string}>}){
  const {textbookId,pdfPageIndex:raw}=await params; const pdfPageIndex=Number(raw);
  if(!Number.isInteger(pdfPageIndex)) return Response.json({error:"Invalid page index"},{status:400});
  try { resolveTextbookPageRequest(textbookId,pdfPageIndex); const image=await renderTextbookPage(textbookId,pdfPageIndex); return new Response(image,{headers:{"content-type":"image/jpeg","cache-control":"private, max-age=3600","content-disposition":"inline"}}); }
  catch(error){ const message=error instanceof Error?error.message:"Unable to render page"; return Response.json({error:message},{status:message.includes("Unsupported")||message.includes("outside")?404:503}); }
}
