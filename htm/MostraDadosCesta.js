
function MostraDadosCesta(){
  if (window.XMLHttpRequest){xmlhttp=new XMLHttpRequest();}
  else{xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");}
  xmlhttp.open("GET","XMLCart.asp?IDLoja="+IDLojaNum+"",false);
  xmlhttp.send();
  xmlDoc=xmlhttp.responseXML; 
  var x=xmlDoc.getElementsByTagName("item");
  var z=xmlDoc.getElementsByTagName("cart");
  try{currencyProdCart=(z[0].getElementsByTagName("currency")[0].childNodes[0].nodeValue);}
  catch(e){currencyProdCart="R$"}
  try{TotalQtyProdCart=(z[0].getElementsByTagName("TotalQty")[0].childNodes[0].nodeValue);}
  catch(e){TotalQtyProdCart="0"}
  try{subtotalProdCart=(z[0].getElementsByTagName("subtotal")[0].childNodes[0].nodeValue);}
  catch(e){subtotalProdCart="0,00"}
  var iItensCesta=TotalQtyProdCart;
  if(iItensCesta==0){sItem="vazio"} 
  else if(iItensCesta==1){sItem="1 item"}
  else {sItem=iItensCesta+" itens"}
  try{document.getElementById("QtdItensCesta").innerHTML=sItem;}
  catch(e){}
  try{document.getElementById("ValorItensCesta").innerHTML=currencyProdCart + " " + subtotalProdCart;}
  catch(e){}
}

function FuncCartOnPage(IDLoja,iErr,sMsg,sCartText,sCheckoutText,este){
  if(iErr==0)MostraDadosCesta();
}
